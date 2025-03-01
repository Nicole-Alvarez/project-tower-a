import React from 'react';
import {QRCodeSVG} from 'qrcode.react';

interface Props {
  studentName: string;
  courseTitle: string;
  issueDate: string;
  teacherName: string;
  uniqueCode: string;
}

const CertificateTemplate = ({
  studentName,
  courseTitle,
  issueDate,
  teacherName,
  uniqueCode,
}: Props) => {
  const qrToGenerate = location.protocol +'//'+ location.host +'/certificates/' + uniqueCode;
  return (
    <div className="relative w-11/12 max-w-4xl mx-auto mt-16 p-10 bg-white border-[8px] border-purple-300 shadow-2xl rounded-xl overflow-hidden">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-purple-300 to-purple-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tr from-purple-400 to-purple-200 rounded-full opacity-40"></div>
      <div className="flex justify-center items-center mb-6">
        <img
          src="/header-logo.png"
          alt="Certificate Logo"
          className="h-12"
        />
      </div>

      <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">
        Certificate of Completion
      </h1>

      <p className="text-base text-center text-gray-700 mb-10 leading-relaxed">
        This certifies that <br />
        <span className="text-2xl font-extrabold text-purple-900">
          {studentName}
        </span> <br />
        has successfully completed the course <br />
        <span className="italic text-xl text-purple-600">
          "{courseTitle}"
        </span> <br />
        on <span className="text-gray-600">{issueDate}</span>.
      </p>

      <div className="flex justify-center items-center mt-[50px]">
        <div className="text-center">
          <p className="text-base text-purple-800 font-semibold uppercase">
            {teacherName}
          </p>
          <hr className="w-48 border-t-2 border-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Teacher</p>
        </div>
      </div>

      <div className="absolute bottom-10 left-5 border p-1">
        <QRCodeSVG fgColor='#505050' value={qrToGenerate} size={70} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-600 to-purple-300 rounded-t-lg"></div>
    </div>
  );
};

export default CertificateTemplate;
