import {FC, useEffect, useState} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {Layout} from '@/widgets/layout';
import {Badge, Input, Pagination, Table} from '@/shared/ui';
import {useVolunteerRatingsAdmin} from '@/entities/volunteer-rating';
import {cn} from "@/shared/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

export const ReviewsPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useVolunteerRatingsAdmin({
    page,
    limit: 10,
    search: searchDebounced || undefined,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          {t('reviews.title')}
        </h1>

        <div className="mb-4 sm:mb-6">
          <Input
            placeholder={t('reviews.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-80 min-w-0"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('reviews.empty')}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block w-full overflow-x-auto rounded-lg shadow bg-white">
              <Table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.volunteer')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.contact')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.score')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.comment')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.task')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.createdAt')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white ring-1 ring-gray-50">
                  {items.map((rating) => (
                      <tr key={rating.id} className="hover:bg-gray-50 ring-1 ring-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`${rating.volunteerFirstName ?? ''} ${rating.volunteerLastName ?? ''}`.trim() ||
                            rating.volunteerEmail ||
                            rating.volunteerPhone ||
                            rating.volunteerUserId}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ID: {rating.volunteerUserId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {rating.volunteerEmail || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rating.volunteerPhone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={star <= rating.score ? 'text-yellow-500' : 'text-gray-300'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm">({rating.score})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs line-clamp-3">
                          {rating.comment || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default" className="text-xs">
                          {rating.taskId}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

              <div className="md:hidden flex flex-col gap-3">
                  {items.map((rating) => (
                      <div
                          key={rating.id}
                          className="p-5 border-[#e5e5e5] shadow-[1px_1px_0_0_#e5e5e5,3px_3px_0_0_#e5e5e5] rounded-2xl bg-white flex flex-col items-center text-center"
                      >
                          <div className="flex flex-col w-full mb-2">
                              <h3 className="text-lg font-bold text-[#1A1A1A] truncate w-full">
                                  {`${rating.volunteerFirstName ?? ''} ${rating.volunteerLastName ?? ''}`.trim() ||
                                      rating.volunteerEmail ||
                                      rating.volunteerPhone ||
                                      'Volunteer'}
                              </h3>
                              <p className="text-[12px] text-gray-400 mt-0.5 font-medium">
                                  ID: {rating.volunteerUserId}
                              </p>
                          </div>
                          <div className="flex flex-col items-center gap-2 mb-3">
                              <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                          key={star}
                                          className={cn(
                                              "text-xl",
                                              star <= rating.score ? 'text-yellow-400' : 'text-gray-200'
                                          )}
                                      >
                                            ★
                                      </span>
                                  ))}
                                  <div className={"mt-1 text-sm"}>({rating.score})</div>
                              </div>
                              <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
                                 {new Date(rating.createdAt).toLocaleDateString()}
                              </span>
                          </div>

                          {rating.comment && (
                              <div className="w-full bg-gray-50/50 rounded-xl p-3 mb-3 border border-gray-100 italic">
                                  <p className="text-sm text-gray-700 leading-relaxed italic">
                                      "{rating.comment}"
                                  </p>
                              </div>
                          )}
                          <div className="w-full pt-3 border-t border-gray-100 flex justify-center">
        <span className="text-[12px] font-medium text-gray-400">
          {t('reviews.columns.task')}: <span className="text-gray-600">{rating.taskId}</span>
        </span>
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
      </div>
    </Layout>
  );
};

