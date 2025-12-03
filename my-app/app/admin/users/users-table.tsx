"use client";

import * as React from "react";
import { GetUsersResponse, User } from "@/lib/types";
import { getAllUsers } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/ui/error-display";
import { HeaderStats } from "./header-stats";
import { UsersTableToolbar } from "./users-table-toolbar";
import { UsersTableCoreWrapper } from "./users-table-core";
import { UsersTablePagination } from "./users-table-pagination";
import { useUserFilters } from "./use-user-filters";
import { SortingState } from "@tanstack/react-table";

interface UsersTableProps {
  onUserAction: (user: User, action: "editGroups") => void;
  onRefresh?: () => Promise<void> | void;
}

export function UsersTable({ onUserAction, onRefresh }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [usersData, setUsersData] = React.useState<GetUsersResponse>({
    users: [],
    count: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  // Sorting state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false }, // Default sort by name
  ]);

  // Apply filters
  const filteredUsers = useUserFilters({
    users: usersData.users,
    searchTerm,
  });

  // Apply sorting to filtered users before pagination
  const sortedUsers = React.useMemo(() => {
    if (sorting.length === 0) return filteredUsers;

    const sortedData = [...filteredUsers];
    const sort = sorting[0];

    sortedData.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sort.id === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sort.id === "groups") {
        aValue = a.groups.length;
        bValue = b.groups.length;
      } else {
        return 0;
      }

      if (aValue < bValue) return sort.desc ? 1 : -1;
      if (aValue > bValue) return sort.desc ? -1 : 1;
      return 0;
    });

    return sortedData;
  }, [filteredUsers, sorting]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Failed to refresh users:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsersData = await getAllUsers();
      setUsersData(fetchedUsersData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      setError(errorMessage);
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to first page when search or items per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleUserAction = (user: User, action: "editGroups") => {
    onUserAction(user, action);
  };

  // Pagination calculations
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ErrorDisplay error={error} />
        <Button onClick={fetchUsers} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Refreshing users..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <HeaderStats usersData={usersData} />

      {/* Users Table */}
      <div className="rounded-md border">
        <UsersTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <UsersTableCoreWrapper
          users={currentUsers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sorting={sorting}
          onSortingChange={setSorting}
          onUserAction={handleUserAction}
          searchTerm={searchTerm}
        />
      </div>

      {/* Pagination */}
      <UsersTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
