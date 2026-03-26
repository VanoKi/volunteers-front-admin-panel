import {FC, useEffect, useState} from 'react';
import {Modal} from '@/shared/ui';
import {useI18n} from '@/shared/lib/i18n';
import {useCreateNeedyInvite} from '../model';

export interface InviteNeedyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const InviteNeedyModal: FC<InviteNeedyModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                            }) => {
    const { t } = useI18n();
    const [url, setUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const createInvite = useCreateNeedyInvite();

    useEffect(() => {
        if (isOpen && !url && !createInvite.isPending) {
            createInvite.mutate(undefined, {
                onSuccess: (data) => setUrl(data.url),
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setUrl(null);
            setCopied(false);
            createInvite.reset();
        }
    }, [isOpen]);

    const handleCopy = async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
//
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('users.inviteModal.title')}
        >
            <div className="flex flex-col gap-3">
                <p className="text-[15px] text-gray-500 leading-relaxed">
                    {t('users.inviteModal.description')}
                </p>

                {createInvite.isPending ? (
                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <SpinnerIcon />
                        <span className="text-sm font-medium text-gray-500">
              {t('users.inviteModal.generating')}
            </span>
                    </div>
                ) : createInvite.isError ? (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-sm text-red-600 font-medium">
                            {createInvite.error instanceof Error
                                ? createInvite.error.message
                                : t('common.error')}
                        </p>
                    </div>
                ) : url ? (
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <div className="flex items-center justify-between gap-3 p-3 pl-4 pr-3 bg-gray-50 rounded-xl transition-colors
                             hover:border-gray-300 border-2 border-[#E4E4E4] shadow-[1px_1px_0_0_#E4E4E4,3px_3px_0_0_#E4E4E4]">
                <span className="text-sm text-gray-700 font-medium break-all line-clamp-3 select-all">
                  {url}
                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`w-full sm:w-auto px-4 min-h-[48px] rounded-xl text-base font-medium flex items-center justify-center gap-2 shrink-0 border-2 transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                                copied
                                    ? "bg-green-50 border-green-500 text-green-700 shadow-[1px_1px_0_0_#22c55e,3px_3px_0_0_#22c55e]"
                                    : "bg-white border-[#004573] text-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573]"
                            }`}

                        >
                            {copied ? (
                                <>
                                    <CheckIcon />
                                    {t('users.inviteModal.copied')}
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    {t('users.inviteModal.copy')}
                                </>
                            )}
                        </button>
                    </div>
                ) : null}
            </div>
        </Modal>
    );
};
