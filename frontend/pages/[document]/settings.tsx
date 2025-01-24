// "use client";

import { DocumentContext } from "../../context/document_context";
import { useContext, useEffect } from "react";

import { GetServerSideProps } from "next";
import { Settings } from "../../components/settings/settings";

interface IServerProps {
  params: {
    document: string;
  };
}

function SettingsPage({ params }: IServerProps) {
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
    // console.log("whatis happening", currentDoc)
  }, [documentID, setCurrentDocID]);

  return <Settings />;
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

export default SettingsPage;
