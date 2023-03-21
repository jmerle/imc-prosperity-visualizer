import { createAxios } from './axios';

export async function downloadAlgorithmResults(algorithmId: string): Promise<void> {
  const axios = createAxios();

  const detailsResponse = await axios.get(
    `https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/results/tutorial/${algorithmId}`,
  );

  const resultsUrl = JSON.parse(detailsResponse.data).algo.summary.activitiesLog;

  const link = document.createElement('a');
  link.href = resultsUrl;
  link.download = 'results.csv';
  link.target = '_blank';
  link.rel = 'noreferrer';

  document.body.appendChild(link);
  link.click();
  link.remove();
}
