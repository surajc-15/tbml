'use client';

import { AdminUserForm } from '../admin-user-form';

interface NewUserSectionProps {
  createdBy?: string;
}

export function NewUserRegistrationSection({ createdBy = '' }: NewUserSectionProps) {
  return (
    <div className="h-full w-full p-4 md:p-6 lg:p-8 bg-slate-50 fade-up">
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 px-6 md:px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-sky-700 font-semibold">User Management</p>
          <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">Register New Bank User</h2>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
            Create new bank user accounts for your institution. Only administrators can register new users.
          </p>
        </section>

        {/* Form Section */}
        <div className="w-full">
          <AdminUserForm createdBy={createdBy} />
        </div>
      </div>
    </div>
  );
}
