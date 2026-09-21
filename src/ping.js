import http from 'k6/http';
import {sleep, check} from 'k6';

export const options = {
    vus: 10,
    // duration: '30s',
    stages: [
        {duration: '10s', target: 20},
        {duration: '10s', target: 10},
        {duration: '10s', target: 0},
    ],
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)']
};

export default function () {
    let res = http.get('http://localhost:6767/api/v1/products');
    check(res, {"status is 200": (res) => res.status === 200});
    sleep(1);
}
