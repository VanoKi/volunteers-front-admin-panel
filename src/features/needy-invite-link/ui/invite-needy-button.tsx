import {FC, useState} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {InviteNeedyModal} from './invite-needy-modal';

export const InviteNeedyButton: FC = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}   className="w-full h-[44px] px-4 rounded-xl sm:w-auto sm:min-h-0 shrink-0 border-2
       border-[#004573] shadow-[1px_1px_0_0_#004573,3px_3px_0_0_#004573] transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
        {t('users.inviteNeedyLink')}
      </button>
      <InviteNeedyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
