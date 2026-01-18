type Filters = { search: string; authorId?: string; sortOrder: 'desc' | 'asc' };
type AuthorOption = { id: string; name: string; totalPosts: number };
type Props = {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (next: Filters) => void;
  onClear: () => void;
  authors?: AuthorOption[];
};
