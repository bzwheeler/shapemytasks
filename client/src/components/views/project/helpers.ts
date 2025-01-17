import { Project_project_scopes as ProjectPageProjectScopes } from '@/api/queries/types/Project';

export type ProjectScope = ProjectPageProjectScopes;
export type Scopes = (ProjectScope | null)[];

export type SortOption = {
  label: string;
  value: string;
  sort: (scopes: Scopes) => Scopes;
  allowDrag: boolean;
}

export type FilterOption = {
  label: string;
  value: string;
  filter: (scopes: Scopes) => Scopes;
  allowDrag: boolean;
}

export function findScopeIndex(scopes: Scopes, scopeId: string) {
  return scopes.findIndex((s) => s?.id === scopeId);
}

export function moveArrayItem<I>(arr: I[], fromIndex: number, toIndex: number) {
  const item = arr[fromIndex];
  if (!item) { return arr; }
  const arrCopy = [...arr];
  arrCopy.splice(fromIndex, 1);
  arrCopy.splice(toIndex, 0, item);
  return arrCopy;
}

export const SCOPE_SORT_OPTIONS: SortOption[] = [
  {
    label: 'Position',
    value: 'position',
    sort: sortScopesByPosition,
    allowDrag: true,
  },
  {
    label: 'Created At',
    value: 'id',
    sort: sortScopesById,
    allowDrag: false,
  },
  {
    label: 'Progress (Low to High)',
    value: 'progress_asc',
    sort: sortScopesByProgressAsc,
    allowDrag: false,
  },
  {
    label: 'Progress (High to Low)',
    value: 'progress_desc',
    sort: sortScopesByProgressDesc,
    allowDrag: false,
  },
  {
    label: 'Title',
    value: 'title',
    sort: sortScopesByTitle,
    allowDrag: false,
  },
];

export function sortScopesByPosition(scopes: Scopes) {
  return [...scopes].sort((a, b) => {
    let result = compareStringAlphabetically(a?.position, b?.position);
    if (result === 0) {
      result = compareStringNumerically(a?.id, b?.id);
    }
    return result;
  });
}

export function sortScopesById(scopes: Scopes) {
  return [...scopes].sort((a, b) => compareStringNumerically(a?.id, b?.id));
}

export function sortScopesByUpdatedAt(scopes: Scopes) {
  return [...scopes].sort((a, b) => (b?.updatedAt || 0) - (a?.updatedAt || 0));
}

export function sortScopesByClosedAt(scopes: Scopes) {
  return [...scopes].sort((a, b) => (b?.closedAt || 0) - (a?.closedAt || 0));
}

export function sortScopesByProgressAsc(scopes: Scopes) {
  return [...scopes].sort((a, b) => {
    const aProgress = a?.progress || 0;
    const bProgress = b?.progress || 0;
    if (aProgress !== bProgress) { return aProgress - bProgress; }

    return compareStringAlphabetically(a?.title, b?.title);
  });
}

export function sortScopesByProgressDesc(scopes: Scopes) {
  return [...scopes].sort((a, b) => {
    const aProgress = a?.progress || 0;
    const bProgress = b?.progress || 0;
    if (aProgress !== bProgress) { return bProgress - aProgress; }

    return compareStringAlphabetically(a?.title, b?.title);
  });
}

export function sortScopesByTitle(scopes: Scopes) {
  return [...scopes].sort((a, b) => compareStringAlphabetically(a?.title, b?.title));
}

function compareStringAlphabetically(a?: string | null, b?: string | null) {
  const safeA = a || '';
  const safeB = b || '';
  if (safeA < safeB) { return -1; }
  if (safeA > safeB) { return 1; }
  return 0;
}

function compareStringNumerically(a?: string | null, b?: string | null) {
  const safeA = a || '0';
  const safeB = b || '0';
  return (parseInt(safeA, 10) || 0) - (parseInt(safeB, 10) || 0);
}

export const SCOPE_FILTER_OPTIONS: FilterOption[] = [
  {
    label: 'None',
    value: 'none',
    filter: (scopes) => scopes,
    allowDrag: true,
  },
  {
    label: 'Not Started',
    value: 'not_started',
    filter: (scopes) => scopes.filter((s) => (s?.progress || 0) < 1),
    allowDrag: false,
  },
  {
    label: 'In Progress',
    value: 'in_progress',
    filter: (scopes) => scopes.filter((s) => (s?.progress || 0) > 1 && (s?.progress || 0) < 100),
    allowDrag: false,
  },
  {
    label: 'Completed',
    value: 'completed',
    filter: (scopes) => scopes.filter((s) => (s?.progress || 0) > 99),
    allowDrag: false,
  },
  {
    label: 'Incomplete',
    value: 'incomplete',
    filter: (scopes) => scopes.filter((s) => (s?.progress || 0) < 99),
    allowDrag: false,
  },
];
