// Payment abstraction layer (spec Section 14). The donation/withdrawal flow
// only ever calls this service — never a provider directly — so adding a new
// provider later requires no changes to campaign/donation logic, only a new
// adapter registered here.
//
// Each provider must implement: createPaymentIntent(), confirmPayment(),
// handleWebhook(), refund().

import { ApiError } from '../../utils/ApiError.js';
import { manualProvider } from './ManualProvider.js';

const providers = {
  manual: manualProvider,
  // mobile_money: TODO — verify EVC Plus / eDahab / Zaad API availability before implementing
  // bank: TODO — verify local bank transfer/collection API availability before implementing
  // card: TODO — verify an international card processor with Somalia reach before implementing
};

function getProvider(name) {
  const provider = providers[name];
  if (!provider) {
    throw new ApiError(501, 'PROVIDER_NOT_IMPLEMENTED', `Payment provider "${name}" is not yet integrated`);
  }
  return provider;
}

export const PaymentService = {
  createPaymentIntent(providerName, params) {
    return getProvider(providerName).createPaymentIntent(params);
  },
  confirmPayment(providerName, params) {
    return getProvider(providerName).confirmPayment(params);
  },
  handleWebhook(providerName, payload, signature) {
    return getProvider(providerName).handleWebhook(payload, signature);
  },
  refund(providerName, params) {
    return getProvider(providerName).refund(params);
  },
};
