export default [{
    name: "mushaf",
    description: "لعرض القرآن الكريم كاملاً",
    type: 'CHAT_INPUT',
    options: [{
      name: `mushaf_type`,
      description: `قوم بتحديد نوع المصحف الذي تريده`,
      required: true,
      choices:[
        {
          name:`مصحف التجويد الملون`,value:"2"
        },
        {
          name:`مصحف المدينة المنورة صفحة واحدة`,value:"1"
        },
        {
          name:`المصحف نسخة الشمرلي`,value:"4"
        },
        {
          name:`مصحف المدينة النبوية برواية ورش`,value:"7"
        },
        {
          name:`مصحف المدينة النبوية النسخة الحديثة`,value:"5"
        }
      ],
      type: "STRING",
    },{
      name: 'page',
      type: 'NUMBER',
      description: 'إذا كنت تريد تحديد صفحة معينة',
      required: false
    }],
  },{
    name: "setmushaf",
    description: "لرسالة رسالة بيه زر لفتح القرآن الكريم كاملاً",
    type: 'CHAT_INPUT',
    options: [{
      name: `mushaf_type`,
      description: `قوم بتحديد نوع المصحف الذي تريده`,
      required: true,
      choices:[
        {
          name:`مصحف التجويد الملون`,value:"2"
        },
        {
          name:`مصحف المدينة المنورة صفحة واحدة`,value:"1"
        },
        {
          name:`المصحف نسخة الشمرلي`,value:"4"
        },
        {
          name:`مصحف المدينة النبوية برواية ورش`,value:"7"
        },
        {
          name:`مصحف المدينة النبوية النسخة الحديثة`,value:"5"
        }
      ],
      type: "STRING",
    }],
  }
]