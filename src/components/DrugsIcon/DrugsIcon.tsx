import React from 'react'
import drugslogo from '../../assets/img/drugslogo.png'

interface DrugsIconProps {
  size?: number
  v1?: boolean
  v2?: boolean
  v3?: boolean
}

const DrugsIcon: React.FC<DrugsIconProps> = ({ size = 36, v1, v2, v3 }) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? 'saturate(0.5)' : undefined,
    }}
  >
    <img src={drugslogo} height="64"/>
  </span>
)

export default DrugsIcon
