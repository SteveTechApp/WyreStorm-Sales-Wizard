import React from 'react';
import { Proposal } from '../../utils/types.ts';

interface PricingTableProps {
  pricing: Proposal['pricing'];
}

const PricingTable: React.FC<PricingTableProps> = ({ pricing }) => {
  return (
    <div className="max-w-md ml-auto">
      <table className="w-full">
        <tbody>
          <tr>
            <td className="p-2 font-semibold">Hardware Total</td>
            <td className="p-2 text-right">${pricing.hardwareTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="p-2 font-semibold">Labor Total</td>
            <td className="p-2 text-right">${pricing.laborTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="p-2 font-semibold">Ancillary Total</td>
            <td className="p-2 text-right">${pricing.ancillaryTotal.toFixed(2)}</td>
          </tr>
          <tr className="border-t-2 border-gray-800">
            <td className="p-2 font-bold text-lg">Grand Total</td>
            <td className="p-2 text-right font-bold text-lg">${pricing.grandTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;