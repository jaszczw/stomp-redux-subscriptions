const getHeaders = (replyTarget) => ({
  'content-type': 'application/json',
  'reply-to': replyTarget,
});

export const createSubscriptionInitializer = (replyTarget, data, subId) => (stomp) => {
  const headers = getHeaders(replyTarget);
  const dataPayload = JSON.stringify({payload: data, subId});

  stomp.send('/topic/create_subscription', dataPayload, headers);
};
