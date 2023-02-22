import { useState } from 'react';
import { RangeSlider } from '@mantine/core';

export function HistogramComponent() {
	const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
  
	return (
	  <>
		<RangeSlider
			value={rangeValue} onChangeEnd={setRangeValue}
		/>
	  </>
	);
}