import { useState } from 'react';

import { useFetchClient, useNotification, Layouts } from '@strapi/strapi/admin';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Typography,
} from '@strapi/design-system';
import { ArrowClockwise } from '@strapi/icons';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<null | {
    created: number;
    updated: number;
    total: number;
  }>(null);

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const { data } = await post('/github-sync/sync');

      setLastResult(data);
      toggleNotification({
        type: 'success',
        message: formatMessage(
          {
            id: getTranslation('settings.sync.success'),
            defaultMessage: 'GitHub sync finished. {total} repositories processed.',
          },
          { total: data?.total ?? 0 }
        ),
      });
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({
          id: getTranslation('settings.sync.error'),
          defaultMessage:
            'GitHub sync failed. Check your plugin server logs and GitHub credentials.',
        }),
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Layouts.Root>
      <Layouts.Header
        title={formatMessage({
          id: getTranslation('settings.page.title'),
          defaultMessage: 'GitHub Sync',
        })}
        subtitle={formatMessage({
          id: getTranslation('settings.page.subtitle'),
          defaultMessage: 'Import your public GitHub repositories into Strapi project entries.',
        })}
      />
      <Layouts.Content>
        <Flex direction="column" alignItems="stretch" gap={6}>
          <Card>
            <CardHeader padding={4}>
              <Typography variant="beta" tag="h2">
                {formatMessage({
                  id: getTranslation('settings.overview.title'),
                  defaultMessage: 'What this plugin does',
                })}
              </Typography>
            </CardHeader>
            <CardBody padding={4}>
              <Flex direction="column" alignItems="stretch" gap={4}>
                <Typography variant="omega" textColor="neutral600">
                  {formatMessage({
                    id: getTranslation('settings.overview.body'),
                    defaultMessage:
                      'This plugin reads repositories from the configured GitHub account and creates or updates entries in your project collection. Existing featured flags remain untouched, so manual curation inside Strapi is preserved.',
                  })}
                </Typography>
                <Divider />
                <Box background="neutral100" hasRadius padding={4}>
                  <Typography variant="pi" fontWeight="bold" textColor="neutral800">
                    {formatMessage({
                      id: getTranslation('settings.requirements.title'),
                      defaultMessage: 'Required environment variables',
                    })}
                  </Typography>
                  <Typography variant="pi" textColor="neutral600">
                    `GITHUB_TOKEN`, `GITHUB_USERNAME`
                  </Typography>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardHeader padding={4}>
              <Typography variant="delta" tag="h2">
                {formatMessage({
                  id: getTranslation('settings.actions.title'),
                  defaultMessage: 'Actions',
                })}
              </Typography>
            </CardHeader>
            <CardBody padding={4}>
              <Flex direction="column" alignItems="stretch" gap={4}>
                <Typography variant="omega" textColor="neutral600">
                  {formatMessage({
                    id: getTranslation('settings.actions.body'),
                    defaultMessage:
                      'Run a manual sync at any time to fetch the latest repositories and push them into your project content type.',
                  })}
                </Typography>
                <Flex gap={3}>
                  <Button onClick={handleSync} loading={isSyncing} startIcon={<ArrowClockwise />}>
                    {formatMessage({
                      id: getTranslation('settings.actions.sync'),
                      defaultMessage: 'Sync now',
                    })}
                  </Button>
                </Flex>
                {lastResult ? (
                  <Box background="neutral100" hasRadius padding={4}>
                    <Typography variant="pi" textColor="neutral700">
                      {formatMessage(
                        {
                          id: getTranslation('settings.actions.result'),
                          defaultMessage:
                            'Last run: {created} created, {updated} updated, {total} total processed.',
                        },
                        lastResult
                      )}
                    </Typography>
                  </Box>
                ) : null}
              </Flex>
            </CardBody>
          </Card>
        </Flex>
      </Layouts.Content>
    </Layouts.Root>
  );
};

export { SettingsPage };
