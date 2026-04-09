import { ChevronDown } from "lucide-react";

import { roleProfiles } from "../../mock/poweros-data";
import { usePowerStore } from "../../store/usePowerStore";

export default function RoleSwitcher() {
  const roleId = usePowerStore((state) => state.roleId);
  const setRole = usePowerStore((state) => state.setRole);

  return (
    <label className="surface-button relative flex min-w-[220px] items-center rounded-[22px] px-4 py-3.5">
      <div className="pr-7">
        <div className="text-[10px] uppercase tracking-[0.34em] text-slate-500">
          当前角色
        </div>
        <select
          value={roleId}
          onChange={(event) => setRole(event.target.value as typeof roleId)}
          className="mt-1 w-full appearance-none bg-transparent text-sm font-medium text-white outline-none"
        >
          {roleProfiles.map((role) => (
            <option key={role.id} value={role.id} className="bg-slate-900">
              {role.title} · {role.name}
            </option>
          ))}
        </select>
      </div>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </label>
  );
}
