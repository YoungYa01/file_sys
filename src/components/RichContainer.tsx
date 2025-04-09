type Props = {
  data: string;
  className?: string;
};

const RichContainer = ({ data, className }: Props) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: data }} className={className} />
  );
};

export default RichContainer;
