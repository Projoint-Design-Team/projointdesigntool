// services/api.ts
import axios from "axios";
import {
  Attribute,
  FixedProfileProps,
  SettingsProps,
} from "../context/attributes_context";
import {
  preproccessAttributes,
  preprocessCrossRestrictions,
  preprocessRestrictions,
  preprocessSettings,
} from "./utils";
import { RestrictionProps } from "@/components/restrictions/restriction";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default api;

// services/api.ts
export const downloadSurvey = async (
  attributes: Attribute[],
  path: "export_qsf" | "export_js" | "export_csv" | "export_json",
  filename: string,
  setDownloadStatus: (status: any) => void,
  settings: SettingsProps,
  fixedProfile: { [key: string]: string },
  csv_lines?: number,
  restrictions?: RestrictionProps[],
  crossRestrictions?: RestrictionProps[],
  instructions?: {
    qDescription: string;
    doubleQ: boolean;
    qType: string;
    qText: string;
  }
) => {
  const fileExtension = (filename: string) => {
    switch (path) {
      case "export_qsf":
        return filename + ".qsf";
      case "export_js":
        return filename + ".js";
      case "export_csv":
        return filename + ".csv";
      case "export_json":
        return filename + ".json";
      default:
        return filename;
    }
  };

  const file = fileExtension(filename);
  setDownloadStatus({
    isActive: true,
    filename: file,
    export: true,
    completed: false,
    error: false,
  });

  try {
    const processedAttributes = preproccessAttributes(attributes);
    const processedRestrictions = preprocessRestrictions(restrictions || []);
    const processedCrossRestrictions = preprocessCrossRestrictions(
      crossRestrictions || []
    );
    // Only export settings for qsf and json
    const processedSettings =
      path === "export_qsf" || path === "export_json"
        ? preprocessSettings(settings)
        : {};

    const preprocessedInstructions = path !== "export_csv" ? instructions : {};

    const response = await api.post(
      `/surveys/${path}/`,
      {
        ...processedAttributes,
        csv_lines,
        restrictions: processedRestrictions,
        cross_restrictions: processedCrossRestrictions,
        filename: file,
        fixed_profile: fixedProfile,
        ...processedSettings,
        ...preprocessedInstructions,
      },
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/octet-stream" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file);
    document.body.appendChild(link);
    link.click();

    setDownloadStatus((prev: any) => ({
      ...prev,
      downloadUrl: url,
      completed: true,
    }));
  } catch (error: any) {
    console.error("Error during file download");
    setDownloadStatus((prev: any) => ({
      ...prev,
      isActive: true,
      error: true,
      errorMessage: error.response.data.error,
    }));
  }
};

export const getPreview = async (
  attributes: Attribute[],
  restrictions: RestrictionProps[],
  crossRestrictions: RestrictionProps[],
  numProfiles: number,
  fixedProfile: { [key: string]: string }
): Promise<{ attributes: string[]; previews: string[][] }> => {
  try {
    const processedAttributes = preproccessAttributes(attributes);
    const processedRestrictions = preprocessRestrictions(restrictions);
    const processedCrossRestrictions =
      preprocessCrossRestrictions(crossRestrictions);

    const response = await api.post("/surveys/preview_survey/", {
      ...processedAttributes,
      restrictions: processedRestrictions,
      cross_restrictions: processedCrossRestrictions,
      filename: "preview",
      num_profiles: numProfiles,
      fixed_profile: fixedProfile,
    });

    // Extract attributes and previews from the response
    const { attributes: responseAttributes, previews } = response.data;

    // Convert each object in previews to an array of its values
    const simplifiedPreviews = previews.map(
      (preview: { [key: string]: string }) =>
        responseAttributes.map((attribute: string) => preview[attribute])
    );

    return { attributes: responseAttributes, previews: simplifiedPreviews };
  } catch (error) {
    console.error("Error during file download", error);
  }
  return { attributes: [], previews: [] };
};

export const getTutorials = async () => {
  const response = await api.get("/documents/list/");
  return response.data;
};

export const getTutorial = async (tutorial: string) => {
  const tutorialWithoutMd = tutorial.replace(".md", "");

  const response = await api.get(`/documents/${tutorialWithoutMd}/`);
  return response.data;
};

export const importDocument = async (
  file: FormData,
  onProgress: (percentage: number) => void
) => {
  try {
    // Assuming `file` has a field that contains the file
    const fileData = file.get("file"); // 'file' should match the key used when appending the file to FormData

    if (!(fileData instanceof File)) {
      throw new Error("No file provided.");
    }

    const filename = fileData.name;

    file.append("filename", filename);

    if (!filename) {
      throw new Error("No file provided.");
    }

    const fileExtension = filename.split(".").pop()?.toLowerCase();

    if (!fileExtension) {
      throw new Error("No file extension provided.");
    }

    let endpoint;
    switch (fileExtension) {
      case "qsf":
        endpoint = "/surveys/import_qsf/";
        break;
      case "json":
        endpoint = "/surveys/import_json/";
        break;
      default:
        throw new Error(
          "Unsupported file format. Please upload a .qsf or .json file."
        );
    }

    const response = await api.post(endpoint, file, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        onProgress(percentCompleted);
      },
    });
    return response.data; // This assumes the response structure has `data`
  } catch (error: any) {
    throw new Error(error.response.data.error); // Rethrow to be caught by the calling component
  }
};
