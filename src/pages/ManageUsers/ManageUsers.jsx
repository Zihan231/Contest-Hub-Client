import React, { useState } from 'react';
import { FaUsers, FaUserShield, FaPaintBrush, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    // --- MOCK DATA (Replace with useQuery / axios.get) ---
    const [users, setUsers] = useState([
        { id: 1, name: "Zihaul Islam", email: "zihaul@admin.com", photo: "https://i.pravatar.cc/150?img=11", role: "Admin" },
        { id: 2, name: "Jane Doe", email: "jane@creator.com", photo: "https://i.pravatar.cc/150?img=5", role: "Creator" },
        { id: 3, name: "John Smith", email: "john@user.com", photo: "https://i.pravatar.cc/150?img=3", role: "User" },
        { id: 4, name: "Sarah Connor", email: "sarah@user.com", photo: "https://i.pravatar.cc/150?img=9", role: "User" },
        { id: 5, name: "Mike Ross", email: "mike@creator.com", photo: "https://i.pravatar.cc/150?img=12", role: "Creator" },
    ]);

    // --- CALCULATE STATS ---
    const adminCount = users.filter(u => u.role === "Admin").length;
    const creatorCount = users.filter(u => u.role === "Creator").length;
    const userCount = users.filter(u => u.role === "User").length;

    // --- HANDLER: CHANGE ROLE ---
    const handleRoleChange = (userId, newRole, currentRole) => {
        // Prevent unnecessary updates
        if (newRole === currentRole) return;

        Swal.fire({
            title: "Update User Role?",
            text: `Are you sure you want to change this user's role to ${newRole}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-primary, #661AE6)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update Role"
        }).then((result) => {
            if (result.isConfirmed) {
                // API Call would go here (e.g., axios.patch(`/users/role/${userId}`, { role: newRole }))
                
                // Update Local State
                const updatedUsers = users.map(user => 
                    user.id === userId ? { ...user, role: newRole } : user
                );
                setUsers(updatedUsers);

                Swal.fire("Updated!", `User is now an ${newRole}.`, "success");
            } else {
                // Reset the select dropdown if cancelled (UI trick to force re-render or just leave it)
                // In a real app with react-query, fetching data again handles this perfectly.
                // For local state, we might need to force update if we want the select to snap back visually.
            }
        });
    };

    // Helper to render role badge
    const renderRoleBadge = (role) => (
        <div className={`badge badge-sm font-bold gap-2 p-3
            ${role === 'Admin' ? 'badge-error text-white' : ''}
            ${role === 'Creator' ? 'badge-primary text-white' : ''}
            ${role === 'User' ? 'badge-ghost' : ''}
        `}>
            {role === 'Admin' && <FaUserShield className="text-xs" />}
            {role === 'Creator' && <FaPaintBrush className="text-xs" />}
            {role === 'User' && <FaUser className="text-xs" />}
            {role}
        </div>
    );

    return (
        <div className="w-full space-y-8">
            
            {/* --- HEADER & STATS --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-base-content">Manage Users</h2>
                    <p className="text-base-content/60">Control user access and permissions.</p>
                </div>

                {/* Stats Widget - Responsive Layout */}
                <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-200 w-full xl:w-auto">
                    
                    {/* Total Admins */}
                    <div className="stat place-items-center px-4 py-3 lg:py-2">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60 flex gap-1 items-center">
                           <FaUserShield /> Admins
                        </div>
                        <div className="stat-value text-error text-2xl">{adminCount}</div>
                    </div>
                    
                    {/* Total Creators */}
                    <div className="stat place-items-center px-4 py-3 lg:py-2 lg:border-l border-base-200">
                        <div className="stat-title text-xs font-bold uppercase tracking-wider opacity-60 flex gap-1 items-center">
                            <FaPaintBrush /> Creators
                        </div>
                        <div className="stat-value text-primary text-2xl">{creatorCount}</div>
                    </div>

                    {/* Total Users */}
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
                        {/* Table Head */}
                        <thead className="bg-base-200/50 text-base-content/60">
                            <tr>
                                <th>#</th>
                                <th>User Info</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Change Role</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <th>{index + 1}</th>
                                    {/* User Info (Avatar + Name) */}
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-10 h-10">
                                                    <img src={user.photo} alt={user.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-xs opacity-50">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Email */}
                                    <td className="font-mono text-xs">{user.email}</td>
                                    {/* Current Role Badge */}
                                    <td>{renderRoleBadge(user.role)}</td>
                                    {/* Action: Change Role Dropdown */}
                                    <td>
                                        <select 
                                            className="select select-bordered select-xs w-full max-w-xs focus:select-primary font-semibold"
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.role)}
                                        >
                                            <option value="User">User</option>
                                            <option value="Creator">Creator</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MOBILE VIEW: CARDS --- */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {users.map((user) => (
                    <div key={user.id} className="card bg-base-100 shadow-md border border-base-200">
                        <div className="card-body p-5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img src={user.photo} alt={user.name} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
                                    <p className="text-xs opacity-50 font-mono">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-base-200 pt-4 mt-2">
                                <div className="text-sm font-semibold opacity-70">Role:</div>
                                {renderRoleBadge(user.role)}
                            </div>

                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text text-xs font-bold uppercase tracking-wider opacity-60">Change Role</span>
                                </label>
                                <select 
                                    className="select select-bordered select-sm w-full focus:select-primary font-semibold"
                                    value={user.role} 
                                    onChange={(e) => handleRoleChange(user.id, e.target.value, user.role)}
                                >
                                    <option value="User">User</option>
                                    <option value="Creator">Creator</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ManageUsers;