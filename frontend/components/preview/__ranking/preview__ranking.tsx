import React, { FC, useState } from "react";
import styles from "./preview__ranking.module.css";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { IProfile } from "../preview";

export interface PreviewRankingProps {
  refresh: boolean; // Prop to trigger refresh (not used in current implementation)
  profiles: IProfile[]; // Initial list of profiles
}

// Helper function to reorder the list after drag and drop
const reorder = (
  list: IProfile[],
  startIndex: number,
  endIndex: number
): IProfile[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const PreviewRanking: FC<PreviewRankingProps> = ({
  profiles,
  refresh, // 'refresh' prop is currently unused
}) => {
  const [profilesData, setProfilesData] = useState<IProfile[]>(profiles);

  const onDragEnd = (result: DropResult) => {
    // If dropped outside the list, do nothing
    if (!result.destination) {
      return;
    }

    // Reorder the list based on drag and drop result
    const reorderedItems = reorder(
      profilesData,
      result.source.index,
      result.destination.index
    );

    setProfilesData(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.preview__ranking}>
        {/* Display ranking numbers */}
        <ul className={styles.ranking__index}>
          {profilesData.map((_, index) => (
            <li key={index}>{index + 1}</li>
          ))}
        </ul>
        {/* Droppable area for ranking */}
        <Droppable droppableId="droppable--ranking" type="ranking">
          {(provided) => (
            <ul
              className={styles.profiles}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {profilesData.map((profile, index) => (
                // Draggable item for each profile
                <Draggable
                  key={profile.id}
                  draggableId={`draggable-profile-${profile.id}`}
                  index={index}
                >
                  {(providedHere) => (
                    <li
                      ref={providedHere.innerRef}
                      {...providedHere.draggableProps}
                      {...providedHere.dragHandleProps}
                      className={styles.profile}
                    >
                      {profile.value}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
