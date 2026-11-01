import InquiryCard from './InquiryCard';

const InquiryList = ({ inquiries, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {inquiries.map((inquiry) => (
        <InquiryCard key={inquiry._id} inquiry={inquiry} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default InquiryList;
