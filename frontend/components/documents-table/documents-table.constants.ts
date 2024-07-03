const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // "short" gives the abbreviated month.
    day: "2-digit", // "2-digit" gives the two-digit day.
  });
};

export interface DocumentData {
  name: string;
  attributesCount: number;
  restrictions: number;
  date: string; // Last modified date
  id: string;
}

export const fetchDocuments = (): DocumentData[] => {
  const documents: DocumentData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("attributes-")) {
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        documents.push({
          name: data.name,
          id: key.substring(11),
          attributesCount: data.attributes ? data.attributes.length : 0,
          restrictions:
            data.restrictions && data.crossRestrictions
              ? data.restrictions.length + data.crossRestrictions.length
              : 0,
          date: formatDate(data.lastEdited),
        });
      }
    }
  }
  return documents;
};
