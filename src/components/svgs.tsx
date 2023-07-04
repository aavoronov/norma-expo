import Svg, { SvgProps, Path } from "react-native-svg";

export const Check = (props: SvgProps) => (
  <Svg
    {...props}
    // xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill='none'>
    <Path stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.333 4 6 11.333 2.667 8' />
  </Svg>
);
