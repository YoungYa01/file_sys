type Props = {
  data: string;
  style?: React.CSSProperties;
  className?: string;
};
const Requirements = (props: Props): JSX.Element => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: props.data }} {...props} />
    </>
  );
};

export default Requirements;
