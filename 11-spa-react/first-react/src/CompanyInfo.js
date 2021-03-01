export default function CompanyInfo({ data }) {
    return (
      <>
        <b>{data.name}</b><br />
        {data.address.street}<br />
        {data.address.province} {data.address.zipCode}<br />
      Tel: {data.phone}
      </>
    )
  }