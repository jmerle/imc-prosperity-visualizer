import { Button, Code, PasswordInput, Select, Text } from '@mantine/core';
import { AxiosResponse } from 'axios';
import { FormEvent, useCallback, useRef } from 'react';
import { AlgorithmSummary } from '../../models';
import { useStore } from '../../store';
import { useAsync } from '../../utils/async';
import { createAxios } from '../../utils/axios';
import { AlgorithmList } from './AlgorithmList';
import { ErrorAlert } from './ErrorAlert';
import { HomeCard } from './HomeCard';

export function LoadFromProsperity(): JSX.Element {
  const idToken = useStore(state => state.idToken);
  const setIdToken = useStore(state => state.setIdToken);

  const round = useStore(state => state.round);
  const setRound = useStore(state => state.setRound);

  const formRef = useRef<HTMLFormElement>(null);

  const loadAlgorithms = useAsync<AlgorithmSummary[]>(async (): Promise<AlgorithmSummary[]> => {
    const axios = createAxios();

    let response: AxiosResponse;
    try {
      response = await axios.get(
        `https://bz97lt8b1e.execute-api.eu-west-1.amazonaws.com/prod/submission/algo/${round}`,
      );
    } catch (err: any) {
      if (err.response?.status === 401) {
        throw new Error('ID token is invalid, please change it.');
      }

      throw err;
    }

    return JSON.parse(response.data).sort(
      (a: AlgorithmSummary, b: AlgorithmSummary) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
    );
  });

  const onSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (idToken.trim().length === 0) {
        return;
      }

      loadAlgorithms.call();
    },
    [loadAlgorithms],
  );

  return (
    <HomeCard title="Load from Prosperity">
      {/* prettier-ignore */}
      <Text>
        Requires your Prosperity ID token that is stored in the <Code>CognitoIdentityServiceProvider.&lt;some id&gt;.&lt;email&gt;.idToken</Code> cookie and/or in the <Code>CognitoIdentityServiceProvider.&lt;some id&gt;.&lt;some id&gt;.idToken</Code> local storage item on the Prosperity website.
        The ID token is remembered locally for ease-of-use but only valid for a limited amount of time, so you&apos;ll need to update this field often.
      </Text>

      {/* prettier-ignore */}
      <Text mt="xs">
        IMC Prosperity Visualizer only uses your ID token to list your algorithms and to download algorithm logs and results.
        It communicates directly with the API used by the Prosperity website and never sends data to other servers.
        The ID token is cached in your browser&apos;s local storage and not accessible by other websites.
      </Text>

      {loadAlgorithms.error && <ErrorAlert error={loadAlgorithms.error} mt="xs" />}

      <form onSubmit={onSubmit} ref={formRef}>
        <PasswordInput
          label="ID token"
          placeholder="ID token"
          value={idToken}
          onInput={e => setIdToken((e.target as HTMLInputElement).value)}
          mt="xs"
        />

        <Select
          label="Round"
          value={round}
          onChange={value => setRound(value!)}
          data={[
            { value: 'ROUND0', label: 'Tutorial' },
            { value: 'ROUND1', label: 'Round 1' },
            { value: 'ROUND2', label: 'Round 2' },
            { value: 'ROUND3', label: 'Round 3' },
            { value: 'ROUND4', label: 'Round 4' },
            { value: 'ROUND5', label: 'Round 5' },
          ]}
          mt="xs"
        />

        <Button fullWidth type="submit" loading={loadAlgorithms.loading} mt="md">
          <div>Load algorithms</div>
        </Button>
      </form>

      {loadAlgorithms.success && <AlgorithmList algorithms={loadAlgorithms.result!} />}
    </HomeCard>
  );
}
