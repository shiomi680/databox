'use client'
import React, { useEffect } from 'react';
import { ShipFormData, componentInfo } from '@/lib/client/data-handle/ship-data';

import { GeneralForm } from '../panels/general-form-panel';


type ShippingFormProps = {
  initialData: ShipFormData,
  onChange: (data: ShipFormData) => void,
}
function ShippingForm({ initialData, onChange }: ShippingFormProps) {
  return (
    <GeneralForm
      fieldParams={componentInfo}
      initialData={initialData}
      onChange={onChange} // corrected here
    ></GeneralForm>
  )
}


export default ShippingForm;