import { Box, Center, SegmentedControl } from '@mantine/core';
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { useStore } from '../../store';

export function ThemeSwitch(): JSX.Element {
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);

  return (
    <SegmentedControl
      value={theme}
      onChange={setTheme}
      data={[
        {
          label: (
            <Center>
              <IconSun size={16} />
              <Box ml="xs">Light</Box>
            </Center>
          ),
          value: 'light',
        },
        {
          label: (
            <Center>
              <IconMoon size={16} />
              <Box ml="xs">Dark</Box>
            </Center>
          ),
          value: 'dark',
        },
        {
          label: (
            <Center>
              <IconDeviceDesktop size={16} />
              <Box ml="xs">System</Box>
            </Center>
          ),
          value: 'system',
        },
      ]}
    />
  );
}
