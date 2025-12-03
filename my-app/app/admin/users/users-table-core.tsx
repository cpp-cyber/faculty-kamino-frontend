import React from "react";
import { SortingState } from "@tanstack/react-table";
import { User } from "@/lib/types";
import { UsersTableCore } from "./users-table-columns";

interface UsersTableCoreWrapperProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onUserAction: (user: User, action: "editGroups") => void;
  searchTerm?: string;
}

export function UsersTableCoreWrapper({
  users,
  sorting,
  onSortingChange,
  onUserAction,
  searchTerm = "",
}: UsersTableCoreWrapperProps) {
  return (
    <UsersTableCore
      users={users}
      searchTerm={searchTerm}
      onUserAction={onUserAction}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  );
}
