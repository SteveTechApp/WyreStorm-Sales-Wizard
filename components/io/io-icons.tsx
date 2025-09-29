import React from 'react';
import { IconProps } from './io-types';

export const HdmiIcon: React.FC<IconProps> = ({ className }) => <span className={className}>HDMI</span>;
export const UsbCIcon: React.FC<IconProps> = ({ className }) => <span className={className}>USB-C</span>;
export const DisplayPortIcon: React.FC<IconProps> = ({ className }) => <span className={className}>DP</span>;
export const VgaIcon: React.FC<IconProps> = ({ className }) => <span className={className}>VGA</span>;
export const AudioJackIcon: React.FC<IconProps> = ({ className }) => <span className={className}>3.5mm</span>;
export const XlrIcon: React.FC<IconProps> = ({ className }) => <span className={className}>XLR</span>;
export const DirectIcon: React.FC<IconProps> = ({ className }) => <span className={className}>Direct</span>;
export const HdbasetIcon: React.FC<IconProps> = ({ className }) => <span className={className}>HDBT</span>;
export const AvoipIcon: React.FC<IconProps> = ({ className }) => <span className={className}>AVoIP</span>;
export const FiberIcon: React.FC<IconProps> = ({ className }) => <span className={className}>Fiber</span>;
