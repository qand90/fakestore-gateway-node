import http from 'k6/http';
import { check, sleep } from 'k6';

// =============================================================================
// CONFIG — Edit these values to adjust the test for fakestore-gateway-node-github
// =============================================================================

const TARGET_URL     = 'https://your-endpoint-here';  // ← set this before running
const HTTP_METHOD    = 'GET';                          // GET | POST | PUT | DELETE
const EXPECT_STATUS  = 200;

const VIRTUAL_USERS  = 50;
const DURATION       = '1m';

const THRESHOLDS = {
  p95_latency_ms : 500,   // 95th percentile response time must be under 500ms
  error_rate     : 0.01,  // less than 1% of requests may fail
};

// =============================================================================

export const options = {
  vus:      VIRTUAL_USERS,
  duration: DURATION,
  thresholds: {
    http_req_duration: [`p(95)<${THRESHOLDS.p95_latency_ms}`],
    http_req_failed:   [`rate<${THRESHOLDS.error_rate}`],
  },
};

export default function () {
  let res;

  if (HTTP_METHOD === 'GET') {
    res = http.get(TARGET_URL);
  } else if (HTTP_METHOD === 'POST') {
    res = http.post(TARGET_URL, null, { headers: { 'Content-Type': 'application/json' } });
  } else if (HTTP_METHOD === 'PUT') {
    res = http.put(TARGET_URL, null, { headers: { 'Content-Type': 'application/json' } });
  } else if (HTTP_METHOD === 'DELETE') {
    res = http.del(TARGET_URL);
  }

  check(res, {
    [`status is ${EXPECT_STATUS}`]: (r) => r.status === EXPECT_STATUS,
    'response time < 2s':           (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
