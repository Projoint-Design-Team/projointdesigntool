"use client";

import { SurveyContainer } from "../../components/survey/survey.container";
import { DocumentContext } from "../../context/document_context";
import { useContext, useEffect } from "react";
import { GetServerSideProps } from "next";

interface IServerProps {
  params: {
    document: string;
  };
}

function DocumentPage({ params }: IServerProps) {
  const documentID = decodeURIComponent(params.document);

  const { setCurrentDoc, setCurrentDocID } = useContext(DocumentContext);

  useEffect(() => {
    // Retrieve document data from local storage
    const localData = localStorage.getItem(`attributes-${documentID}`);
    const parsedData = localData ? JSON.parse(localData) : {};
    const documentName = parsedData?.name;

    // Set the current document name in the context
    setCurrentDoc(documentName);
  }, [documentID, setCurrentDoc]);

  useEffect(() => {
    // Set the current document ID in the context
    setCurrentDocID(documentID);
  }, [documentID, setCurrentDocID]);

  return <SurveyContainer />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const document = context.params?.document;

  // Check if 'document' is a string
  if (typeof document !== "string") {
    // Handle the case where 'document' is not provided or is not a string
    return { notFound: true };
  }

  // Return the document parameter as a prop
  return {
    props: {
      params: {
        document: document || "",
      },
    },
  };
};

export default DocumentPage;
