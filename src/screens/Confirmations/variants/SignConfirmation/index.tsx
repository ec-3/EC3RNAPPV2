import { SignerPayloadJSON } from '@polkadot/types/types';
import { SigningRequest } from '@subwallet/extension-base/background/types';
import AccountItemWithName from 'components/common/Account/Item/AccountItemWithName';
import { ConfirmationContent, ConfirmationGeneralInfo } from 'components/common/Confirmation';
import useParseSubstrateRequestPayload from 'hooks/transaction/confirmation/useParseSubstrateRequestPayload';
import { useEC3Theme } from 'hooks/useEC3Theme';
import React, { useMemo } from 'react';
import { Text } from 'react-native';

import { isSubstrateMessage } from 'utils/confirmation/confirmation';
import i18n from 'utils/i18n/i18n';
import createStyle from './styles';

import { BaseDetailModal, SubstrateMessageDetail, SubstrateTransactionDetail, SubstrateSignArea } from '../../parts';

interface Props {
  request: SigningRequest;
}

const SignConfirmation: React.FC<Props> = (props: Props) => {
  const { request } = props;
  const { id, account } = request;
  const theme = useEC3Theme().swThemes;

  const styles = useMemo(() => createStyle(theme), [theme]);

  const payload = useParseSubstrateRequestPayload(request.request);
  const isMessage = isSubstrateMessage(payload);

  return (
    <React.Fragment>
      <ConfirmationContent>
        <ConfirmationGeneralInfo request={request} />
        <Text style={styles.title}>{i18n.confirmation.signatureRequest}</Text>
        <Text style={styles.description}>{i18n.confirmation.requestWithAccount}</Text>
        <AccountItemWithName accountName={account.name} address={account.address} avatarSize={24} isSelected={true} />
        <BaseDetailModal title={isMessage ? i18n.confirmation.messageDetail : i18n.confirmation.transactionDetail}>
          {isMessage ? (
            <SubstrateMessageDetail bytes={payload} />
          ) : (
            <SubstrateTransactionDetail
              account={account}
              payload={payload}
              request={request.request.payload as SignerPayloadJSON}
            />
          )}
        </BaseDetailModal>
      </ConfirmationContent>
      <SubstrateSignArea payload={payload} account={account} id={id} />
    </React.Fragment>
  );
};

export default SignConfirmation;