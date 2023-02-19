import { NativeSelect } from '@mantine/core';

function Demo() {
  return (
    <NativeSelect
      data={['React', 'Vue', 'Angular', 'Svelte']}
      label="Select your favorite framework/library"
      description="This is anonymous"
      withAsterisk
    />
  );
}

export default Demo;