"use client";

import { SurveyContainer } from "../../components/survey/survey.container";
import { DocumentContext } from "../../context/document_context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

interface IServerProps {
  params: {
    document: string;
  };
}

function DocumentPage({ params }: IServerProps) {
  const router = useRouter();
  const documentID = decodeURIComponent(params.document);
  const { setCurrentDoc, setCurrentDocID } = useContext(DocumentContext);

  useEffect(() => {
    // Check if the document exists in localStorage
    const localData = localStorage.getItem(`attributes-${documentID}`);
    if (!localData) {
      router.push("/404"); // Redirect to 404 page if document doesn't exist
      return;
    }

    // Parse and set document data
    const parsedData = JSON.parse(localData);
    const documentName = parsedData?.name;

    // Set the current document name and ID in the context
    setCurrentDoc(documentName);
  }, [documentID, setCurrentDoc, router]);

  useEffect(() => {
    // Set the current document ID in the context
    setCurrentDocID(documentID);
  }, [documentID, setCurrentDocID, router]);

  return <SurveyContainer />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const document = context.params?.document;

  // Check if 'document' is a string and exists in localStorage
  if (typeof document === "string") {
    return {
      props: {
        params: {
          document: document,
        },
      },
    };
  }

  // If document is not a string or doesn't exist in localStorage, return 404
  return { notFound: true };
};

export default DocumentPage;
