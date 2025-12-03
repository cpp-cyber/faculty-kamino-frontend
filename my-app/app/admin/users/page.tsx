"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { PageLayout } from "@/app/admin/admin-page-layout";
import { UsersTable } from "@/app/admin/users/users-table";
import { EditGroupsDialog } from "@/app/admin/users/edit-groups-dialog";
import { User } from "@/lib/types";

const breadcrumbs = [{ label: "Users", href: "/admin/users" }];

export default function AdminUsersPage() {
  const [editGroupsOpen, setEditGroupsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleUserAction = (user: User, action: "editGroups") => {
    setSelectedUser(user);

    if (action === "editGroups") {
      setEditGroupsOpen(true);
      return;
    }
  };

  return (
    <AuthGuard adminOnly>
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">
                Manage user accounts and permissions
              </p>
            </div>
            <UsersTable
              onUserAction={handleUserAction}
              onRefresh={handleRefresh}
              key={refreshKey}
            />
          </div>
        </div>
      </PageLayout>

      {/* Edit Groups Dialog */}
      <EditGroupsDialog
        user={selectedUser}
        open={editGroupsOpen}
        onOpenChange={setEditGroupsOpen}
        onSuccess={handleRefresh}
      />
    </AuthGuard>
  );
}
