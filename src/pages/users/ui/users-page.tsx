import {FC, useEffect, useState} from 'react';

import type {User, UserRole, UserStatus} from '@/entities/user';
import {useUsersPaginated} from '@/entities/user';
import {useI18n} from '@/shared/lib/i18n';
import {Badge, Input, Modal, Pagination, Select, Table} from '@/shared/ui';
import {Layout} from '@/widgets/layout';
import {CreateNeedyForm} from '@/features/needy-create';
import {CreateVolunteerForm} from '@/features/volunteer-create';
import {InviteNeedyButton} from '@/features/needy-invite-link';
import {AssignProgramsButton} from '@/features/volunteer-assign-programs';
import {UserDetailsModal} from '@/features/user-details';

const SEARCH_DEBOUNCE_MS = 300;

const getRoleKey = (role: UserRole): string =>
  `users.roles.${role as string}`;

const getStatusKey = (status: UserStatus): string =>
  `users.status.${status as string}`;

const getStatusVariant = (
  status: UserStatus | undefined,
): 'success' | 'default' | 'warning' => {
  if (!status) return 'default';
  if (status === 'approved') return 'success';
  if (status === 'blocked') return 'warning';
  return 'default';
};

type StatusFilterValue = UserStatus | 'all';
type RoleFilterValue = UserRole | 'all';

const STATUS_FILTER_OPTIONS: { value: StatusFilterValue; labelKey: string }[] = [
  { value: 'all', labelKey: 'users.filters.all' },
  { value: 'pending', labelKey: 'users.status.pending' },
  { value: 'approved', labelKey: 'users.status.approved' },
  { value: 'blocked', labelKey: 'users.status.blocked' },
];

const ROLE_FILTER_OPTIONS: { value: RoleFilterValue; labelKey: string }[] = [
  { value: 'all', labelKey: 'users.filters.all' },
  { value: 'admin', labelKey: 'users.roles.admin' },
  { value: 'volunteer', labelKey: 'users.roles.volunteer' },
  { value: 'needy', labelKey: 'users.roles.needy' },
];

export const UsersPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateVolunteerModalOpen, setIsCreateVolunteerModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const statusParam = statusFilter === 'all' ? undefined : statusFilter;
  const roleParam = roleFilter === 'all' ? undefined : roleFilter;

  const { data, isLoading, refetch } = useUsersPaginated({
    page,
    limit: 10,
    search: searchDebounced || undefined,
    status: statusParam,
    role: roleParam,
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10) || 1;

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setIsCreateVolunteerModalOpen(false);
    refetch();
  };

  const handleUserDetailsSuccess = () => {
    refetch();
  };

  const handleExportClick = async () => {
    try {
      setIsExporting(true);
      const { userApi } = await import('@/entities/user');
      await userApi.exportUsers({
        status: statusParam,
        role: roleParam,
        search: searchDebounced || undefined,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          {t('users.title')}
        </h1>
          <div className="mb-4 sm:mb-6 space-y-4">
              {/* Мобилка: карточка с фильтрами */}
              <div className="p-4 sm:p-0 bg-white sm:bg-transparent border border-[#e5e5e5] sm:border-0 shadow-[1px_1px_0_0_#e5e5e5,3px_3px_0_0_#e5e5e5] sm:shadow-none rounded-2xl sm:rounded-none mb-4 sm:mb-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                      <div className="w-full sm:w-56 shrink-0">
                          <Input
                              placeholder={t('users.searchPlaceholder')}
                              value={searchInput}
                              onChange={(e) => {
                                  setSearchInput(e.target.value);
                                  setPage(1);
                              }}
                              className="w-full min-h-[44px] rounded-xl sm:min-h-[40px]"
                          />
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto sm:gap-2 pt-2 sm:pt-0 border-t border-gray-100 sm:border-0 mt-2 sm:mt-0">
                          <div className="w-1/2 sm:w-40 relative z-[10]">
                              <Select
                                  label={t('users.filters.status')}
                                  options={STATUS_FILTER_OPTIONS.map((opt) => ({
                                      value: opt.value,
                                      label: t(opt.labelKey),
                                  }))}
                                  value={statusFilter}
                                  onChange={(e) => {
                                      setStatusFilter(e.target.value as StatusFilterValue);
                                      setPage(1);
                                  }}
                                  className="w-full min-h-[44px] rounded-xl sm:min-h-[40px]"
                              />
                          </div>
                          <div className="w-1/2 sm:w-40 relative z-[10]">
                              <Select
                                  label={t('users.filters.role')}
                                  options={ROLE_FILTER_OPTIONS.map((opt) => ({
                                      value: opt.value,
                                      label: t(opt.labelKey),
                                  }))}
                                  value={roleFilter}
                                  onChange={(e) => {
                                      setRoleFilter(e.target.value as RoleFilterValue);
                                      setPage(1);
                                  }}
                                  className="w-full min-h-[44px] rounded-xl sm:min-h-[40px]"
                              />
                          </div>
                      </div>
                  </div>
              </div>

          {/* Кнопки действий */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
            <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
              <InviteNeedyButton />
            </div>
              <button
                  onClick={handleExportClick}
                  className="w-full h-[44px] px-4 rounded-xl sm:w-auto min-h-[44px] sm:min-h-0 shrink-0 border-2 border-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                  disabled={isExporting}
              >
                  {isExporting ? t('users.exporting') : t('users.export')}
              </button>

              <button
                  onClick={() => setIsCreateVolunteerModalOpen(true)}
                  className="w-full h-[44px] px-4 rounded-xl sm:w-auto min-h-[44px] sm:min-h-0 shrink-0 border-2 border-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                  {t('users.addVolunteer')}
              </button>

              <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full h-[44px] px-4 rounded-xl sm:w-auto min-h-[44px] sm:min-h-0 shrink-0 border-2 border-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                  {t('users.addNeedy')}
              </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('users.empty')}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto rounded-lg shadow bg-white">
              <Table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.phone')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.role')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.actions')}
                    </th>
                  </tr>
                </thead>
                  <tbody className="bg-white">
                  {users.map((user: User) => (
                      <tr key={user.id} className="hover:bg-gray-50 ring-1 ring-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                            user.email ||
                            user.phone ||
                            '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {t(getRoleKey(user.role))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(user.status)}>
                          {t(getStatusKey(user.status))}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className={"w-full h-[30px] px-4 rounded-lg sm:w-auto min-h-[44px] sm:min-h-0 shrink-0 border-2 border-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"}
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            {t('users.actions.viewDetails')}
                          </button>
                          {user.role === 'volunteer' && (
                            <AssignProgramsButton
                              volunteerId={user.id}
                              onSuccess={handleCreateSuccess}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-2">
                  {users.map((user: User) => (
                      <div
                          key={user.id}
                          className="p-4 border-[#e5e5e5] shadow-[1px_1px_0_0_#e5e5e5,3px_3px_0_0_#e5e5e5] rounded-xl bg-white flex flex-col items-center text-center"
                      >
                          <div className="flex flex-col w-full items-center">
                              <h3 className="text-[22px] leading-tight font-semibold text-[#1A1A1A] truncate w-full mb-1">
                                  {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                                      user.email ||
                                      user.phone ||
                                      '-'}
                              </h3>

                              {(user.email || user.phone) && (
                                  <p className="text-[14px] text-gray-500 truncate w-full mb-3">
                                      {user.email || user.phone}
                                  </p>
                              )}
                              <div className="flex justify-center items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-sm font-medium text-gray-600 border border-gray-200">
            {t(getRoleKey(user.role))}
                                  </span>

                                  <Badge
                                      variant={getStatusVariant(user.status)}
                                      className="px-3 py-1 rounded-full text-sm font-medium"
                                  >
                                      {t(getStatusKey(user.status))}
                                  </Badge>
                              </div>
                          </div>
                          <div className="w-16 h-px bg-gray-100 my-2" />
                          <div className="mt-2 w-full flex flex-col items-center gap-3">
                              <button
                                  onClick={() => setSelectedUserId(user.id)}
                                  className="w-[180px] h-[44px] px-4 rounded-xl sm:w-auto min-h-[44px] sm:min-h-0 shrink-0 border-2 border-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                              >
                                  {t('users.actions.viewDetails')}
                              </button>

                              {user.role === 'volunteer' && (
                                  <div className="w-full [&>button]:w-full [&>button]:min-h-[48px] [&>button]:rounded-xl [&>button]:justify-center [&>button]:text-base [&>button]:font-medium">
                                      <AssignProgramsButton
                                          volunteerId={user.id}
                                          onSuccess={handleCreateSuccess}
                                      />
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>


              {totalPages > 1 && (
              <div className="mt-4 sm:mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={t('users.addNeedy')}
        >
          <CreateNeedyForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={isCreateVolunteerModalOpen}
          onClose={() => setIsCreateVolunteerModalOpen(false)}
          title={t('users.addVolunteer')}
          size="lg"
        >
          <CreateVolunteerForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateVolunteerModalOpen(false)}
          />
        </Modal>

        <UserDetailsModal
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onSuccess={handleUserDetailsSuccess}
        />
      </div>
    </Layout>
  );
};

