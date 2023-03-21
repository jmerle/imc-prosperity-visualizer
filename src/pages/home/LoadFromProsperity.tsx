import { Button, Code, PasswordInput, Select, Text, TextInput } from '@mantine/core';
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

  const corsProxy = useStore(state => state.corsProxy);
  const setCorsProxy = useStore(state => state.setCorsProxy);

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
        Requires your Prosperity ID token that is stored in the <Code>CognitoIdentityServiceProvider.&lt;some id&gt;.&lt;email&gt;.idToken</Code> cookie on the Prosperity website.
        The ID token is remembered locally for ease-of-use but only valid for a limited amount of time, so you&apos;ll need to update this field often.
      </Text>

      <Text mt="xs">
        When you open an algorithm in the visualizer the results CSV needs to be downloaded. This CSV is served without
        an{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin"
          target="_blank"
          rel="noreferrer"
        >
          Access-Control-Allow-Origin
        </a>{' '}
        header, so a{' '}
        <a href="https://github.com/Rob--W/cors-anywhere" target="_blank" rel="noreferrer">
          CORS Anywhere
        </a>{' '}
        proxy is needed to make that work. By default a proxy provided by me (the creator of IMC Prosperity Visualizer)
        is used. While I promise no results are persisted server-side, you are free to change this to a proxy hosted by
        yourself. Your ID token is not sent through this proxy.
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

        <TextInput
          label="CORS Anywhere proxy"
          placeholder="CORS Anywhere proxy"
          value={corsProxy}
          onInput={e => setCorsProxy((e.target as HTMLInputElement).value)}
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
