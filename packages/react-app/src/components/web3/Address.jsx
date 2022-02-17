export default function Address(props) {
  const address = props.value || props.address;
  return <span style={{ color: "white" }}>{address}</span>;
}
