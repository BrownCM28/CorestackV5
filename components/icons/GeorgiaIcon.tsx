interface Props {
  size?: number
  className?: string
}

// Georgia state outline, traced from the public-domain (CC0) "Blank US
// Map (states only)" on Wikimedia Commons -- this path is Georgia's piece
// of that combined map, cropped to its own bounding box:
// https://commons.wikimedia.org/wiki/File:Blank_US_Map_(states_only).svg
export default function GeorgiaIcon({ size = 96, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size * (105.2 / 101.2)}
      viewBox="663.6 352.2 101.2 105.2"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="m 761.8,414.1 v 1.4 l -4.2,6.2 -1.2,.2 1.5,.5 v 2 l -.9,1.1 -.6,6 -2.3,6.2 .5,2 .7,5.1 -3.6,.3 -4,-.7 -1.7,-.9 -2.2,1.4 v 2.5 l 1.4,2.1 -.5,4.3 -2.1,.6 -1,-1.1 -.6,-3.2 -50.1,3.3 -3.3,-6 -.7,-2.2 -1.5,-1.5 -.5,-1.4 .6,-6.3 -2.4,-5.7 .5,-2.6 .3,-3.7 2.2,-3.8 -.2,-1.1 -1.7,-1 v -3.2 l -1.8,-1.9 -2.9,-6.1 -12.9,-45.8 22.9,-2.9 21.4,-3 -.1,1.9 -1.9,1 -1.4,3.2 .2,1.3 6.1,3.8 2.6,-.3 3.1,4 .4,1.7 4.2,5.1 2.6,1.7 1.4,.2 2.2,1.6 1.1,2.2 2,1.6 1.8,.5 2.7,2.7 .1,1.4 2.6,2.8 5,2.3 3.6,6.7 .3,2.7 3.9,2.1 2.5,4.8 .8,3.1 4.2,.4 z" />
    </svg>
  )
}
