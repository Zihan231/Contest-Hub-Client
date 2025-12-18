import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUsers, FaUserShield, FaPaintBrush, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/axiosSecure/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const getId = (u) => u?._id || u?.id;

  // ✅ normalize role for consistency
  const normalizeRole = (role) => {
    if (!role) return "user";
    return String(role).trim().toLowerCase(); // "Admin" -> "admin"
  };

  // ✅ show label nicely in UI
  const roleLabel = (role) => {
    const r = normalizeRole(role);
    if (r === "admin") return "Admin";
    if (r === "creator") return "Creator";
    return "User";
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("users");
      const payload = res?.data?.data ?? res?.data;
      const arr = Array.isArray(payload) ? payload : [];

      // ✅ IMPORTANT: normalize roles as soon as they come from API
      return arr.map((u) => ({
        ...u,
        role: normalizeRole(u?.role),
      }));
    },
    initialData: [],
  });

  // ✅ counts now always work
  const adminCount = users.filter((u) => normalizeRole(u.role) === "admin").length;
  const creatorCount = users.filter((u) => normalizeRole(u.role) === "creator").length;
  const userCount = users.filter((u) => normalizeRole(u.role) === "user").length;

  const handleRoleChange = async (userId, newRole, currentRole) => {
    if (!userId) return;

    const nextRole = normalizeRole(newRole);
    const prevRole = normalizeRole(currentRole);

    if (nextRole === prevRole) return;

    const result = await Swal.fire({
      title: "Update User Role?",
      text: `Are you sure you want to change this user's role to ${roleLabel(
        nextRole
      )}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary, #661AE6)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Role",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingId(userId);

      // ✅ keep sending normalized role to backend
      await axiosSecure.patch(`users/role/${userId}`, { role: nextRole });

      // ✅ update cache with normalized role
      queryClient.setQueryData(["users"], (prev = []) =>
        prev.map((u) => (getId(u) === userId ? { ...u, role: nextRole } : u))
      );

      Swal.fire("Updated!", `User is now a ${roleLabel(nextRole)}.`, "success");
    } catch (e) {
      Swal.fire("Failed!", "Could not update user role. Try again.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderRoleBadge = (role) => {
    const r = normalizeRole(role);

    return (
      <div
        className={`badge badge-sm font-bold gap-2 p-3
          ${r === "admin" ? "badge-error text-white" : ""}
          ${r === "creator" ? "badge-primary text-white" : ""}
          ${r === "user" ? "badge-ghost" : ""}
        `}
      >
        {r === "admin" && <FaUserShield className="text-xs" />}
        {r === "creator" && <FaPaintBrush className="text-xs" />}
        {r === "user" && <FaUser className="text-xs" />}
        {roleLabel(r)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-6">
        <div className="alert alert-error">
          <span>{error?.message || "Failed to load users"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* --- HEADER & STATS --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-base-content">Manage Users</h2>
          <p className="text-base-content/60">Control user access and permissions.</p>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-200 w-full xl:w-auto">
          <div className="stat place-items-center px-4 py-3 lg:py-2">
            <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60 flex gap-1 items-center">
              <FaUserShield /> Admins
            </div>
            <div className="stat-value text-error text-2xl">{adminCount}</div>
          </div>

          <div className="stat place-items-center px-4 py-3 lg:py-2 lg:border-l border-base-200">
            <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60 flex gap-1 items-center">
              <FaPaintBrush /> Creators
            </div>
            <div className="stat-value text-primary text-2xl">{creatorCount}</div>
          </div>

          <div className="stat place-items-center px-4 py-3 lg:py-2 lg:border-l border-base-200">
            <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60 flex gap-1 items-center">
              <FaUser /> Users
            </div>
            <div className="stat-value text-base-content text-2xl">{userCount}</div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW: TABLE --- */}
      <div className="hidden md:block card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50 text-base-content/60">
              <tr>
                <th>#</th>
                <th>User Info</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => {
                const id = getId(user);
                const photo = user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png";

                return (
                  <tr key={id || index}>
                    <th>{index + 1}</th>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img src={photo} alt={user?.name || "User"} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user?.name || "N/A"}</div>
                          <div className="text-xs opacity-50">ID: {id || "N/A"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="font-mono text-xs">{user?.email || "N/A"}</td>

                    <td>{renderRoleBadge(user?.role)}</td>

                    {/* ✅ values are lowercase -> always match */}
                    <td>
                      <select
                        className="select select-bordered select-xs w-full max-w-xs focus:select-primary font-semibold"
                        value={normalizeRole(user?.role)}  // ✅ always matches option
                        disabled={!id || updatingId === id}
                        onChange={(e) => handleRoleChange(id, e.target.value, user?.role)}
                      >
                        <option value="user">User</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-6 text-center opacity-60">
              <FaUsers className="inline mr-2" /> No users found.
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE VIEW: CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {users.map((user, index) => {
          const id = getId(user);
          const photo =
            user?.photoURL || user?.photo || user?.image || "https://i.ibb.co/4pDNDk1/avatar.png";

          return (
            <div key={id || index} className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={photo} alt={user?.name || "User"} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{user?.name || "N/A"}</h3>
                    <p className="text-xs opacity-50 font-mono">{user?.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-base-200 pt-4 mt-2">
                  <div className="text-sm font-semibold opacity-70">Role:</div>
                  {renderRoleBadge(user?.role)}
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text text-xs font-bold uppercase tracking-wider opacity-60">
                      Change Role
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-sm w-full focus:select-primary font-semibold"
                    value={normalizeRole(user?.role)}
                    disabled={!id || updatingId === id}
                    onChange={(e) => handleRoleChange(id, e.target.value, user?.role)}
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="p-6 text-center opacity-60">
            <FaUsers className="inline mr-2" /> No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
