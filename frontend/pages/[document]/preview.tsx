// "use client";

import { DocumentContext } from "../../context/document_context";
import { useCallback, useContext, useEffect, useState } from "react";
import Preview, { IPreview } from "../../components/preview/preview";

import { GetServerSideProps } from "next";
import { useAttributes } from "../../context/attributes_context";
import { getPreview } from "../../services/api";
import { preprocessFixedProfile } from "@/services/utils";

interface IServerProps {
  params: {
    document: string;
  };
}

function PreviewPage({ params }: IServerProps) {
  const documentID = decodeURIComponent(params.document as string);
  // console.log(documentName);
  const { setCurrentDoc, setCurrentDocID } = useContext(DocumentContext);

  useEffect(() => {
    const localData = localStorage.getItem(`attributes-${documentID}`);
    const parsedData = localData ? JSON.parse(localData) : {};
    const documentName = parsedData?.name;
    setCurrentDoc(documentName);
  }, [documentID, setCurrentDoc]);

  useEffect(() => {
    setCurrentDocID(documentID);
  }, [documentID, setCurrentDocID]);

  const {
    attributes,
    instructions,
    settings,
    cleanInvalidRestrictions,
    processProfileRestrictions,
    processCrossRestrictions,
    fixedProfile,
    fixedProfileEnabled,
    getAttributeById,
    getLevelById,
  } = useAttributes();

  const [profiles, setProfiles] = useState<IPreview | null>(null);

  const [refresh, setRefresh] = useState<boolean>(true);

  const previewData = useCallback(async () => {
    // const previews = await getPreview(attributes, restrictions);
    cleanInvalidRestrictions();
    const previews = await getPreview(
      attributes,
      processProfileRestrictions(),
      processCrossRestrictions(),
      settings.numProfiles,
      fixedProfileEnabled
        ? preprocessFixedProfile(fixedProfile, getAttributeById)
        : {}
    );
    setProfiles({
      attributes: previews.attributes,
      previews: previews.previews,
      instructions: instructions,
    });
  }, [
    attributes,
    processProfileRestrictions,
    processCrossRestrictions,
    settings.numProfiles,
    instructions,
    cleanInvalidRestrictions,
    fixedProfile,
    fixedProfileEnabled,
    getAttributeById,
  ]);

  useEffect(() => {
    previewData();
  }, [attributes]);

  useEffect(() => {
    if (refresh) {
      previewData();
      setRefresh(false);
    }
  }, [refresh, previewData]);

  return profiles ? (
    <Preview {...profiles} setRefresh={setRefresh} refresh={refresh} />
  ) : (
    ""
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const document = context.params?.document;

  // Check if 'document' is a string (or an array of strings if you allow that)
  if (typeof document !== "string") {
    // Handle the case where 'document' is not provided or is not a string
    return { notFound: true }; // Or redirect to another page
  }

  // You can perform server-side operations here, like fetching data based on the document name
  // ...

  // Then return the props
  return {
    props: {
      params: {
        document: document || "",
      },
    },
  };
};

export default PreviewPage;
