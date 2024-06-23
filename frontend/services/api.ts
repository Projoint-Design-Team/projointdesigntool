// services/api.ts
import axios from "axios";
import { Attribute } from "../context/attributes_context";
import {
  preproccessAttributes,
  preprocessCrossRestrictions,
  preprocessRestrictions,
} from "./utils";
import { RestrictionProps } from "@/components/restrictions/restriction";
import { useDownload } from "@/context/download_context";

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
  csv_lines?: number,
  restrictions?: RestrictionProps[],
  crossRestrictions?: RestrictionProps[],
  settings?: number
) => {
  console.log("Starting downloadSurvey");

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
    progress: 0,
    filename: file,
    completed: false,
    error: false,
  });

  try {
    const processedAttributes = preproccessAttributes(attributes);
    const processedRestrictions = preprocessRestrictions(restrictions || []);
    const processedCrossRestrictions = preprocessCrossRestrictions(
      crossRestrictions || []
    );

    const response = await api.post(
      `/surveys/${path}/`,
      {
        ...processedAttributes,
        csv_lines,
        settings,
        restrictions: processedRestrictions,
        cross_restrictions: processedCrossRestrictions,
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
  } catch (error) {
    console.error("Error during file download", error);
    setDownloadStatus((prev: any) => ({
      ...prev,
      isActive: true,
      error: true,
    }));
  }
};

export const getPreview = async (
  attributes: Attribute[],
  restrictions: RestrictionProps[],
  crossRestrictions: RestrictionProps[]
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
  const response = await api.get("/common/docs/list/");
  return response.data;
};

export const getTutorial = async (tutorial: string) => {
  const tutorialWithoutMd = tutorial.replace(".md", "");

  const response = await api.get(`/common/docs/${tutorialWithoutMd}/`);
  return response.data;
};

export const importDocument = async (
  file: FormData,
  onProgress: (percentage: number) => void
) => {
  try {
    const response = await api.post("/surveys/import_json/", file, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        onProgress(percentCompleted);
      },
    });
    return response.data; // This assumes the response structure has `data`
  } catch (error) {
    console.error("Upload error", error);
    throw error; // Throw the error to be caught in the component
  }
};
