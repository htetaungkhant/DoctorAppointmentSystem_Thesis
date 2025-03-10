import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'
import GeneralMedicine from './GeneralMedicine.svg'
import ObGyn from './ObGyn.svg'
import Paediatrics from './Paediatrics.svg'
import Mental from './Mental.svg'
import Surgery from './Surgery.svg'
import Orthopaedics from './Orthopaedics.svg'
import Eye from './Eye.svg'
import ENT from './ENT.svg'
import Dental from './Dental.svg'
import Traditional from './Traditional.svg'

// Helper function to get doctor image based on index
const getDoctorImage = (index) => {
    const images = [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10, doc11, doc12, doc13, doc14, doc15];
    return images[index % images.length];
};

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General Medicine',
        image: GeneralMedicine
    },
    {
        speciality: 'Obstetrics and Gynaecology',
        image: ObGyn
    },
    {
        speciality: 'Paediatrics',
        image: Paediatrics
    },
    {
        speciality: 'Mental Health',
        image: Mental
    },
    {
        speciality: 'Surgery',
        image: Surgery
    },
    {
        speciality: 'Orthopaedics',
        image: Orthopaedics
    },
    {
        speciality: 'Eye',
        image: Eye
    },
    {
        speciality: 'Ear, Nose and Throat',
        image: ENT
    },
    {
        speciality: 'Dental',
        image: Dental
    },
    {
        speciality: 'Traditional Medicine',
        image: Traditional
    }
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Aung Kyaw Moe',
        image: doc1,
        speciality: 'General Medicine',
        degree: 'MBBS, M.Med.Sc (Internal Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Aung Kyaw Moe is a highly experienced internal medicine specialist with over 15 years of practice in Myanmar. He specializes in managing complex chronic diseases and providing comprehensive primary healthcare. His patient-centered approach focuses on preventive care and lifestyle modifications. He regularly participates in medical conferences and contributes to community health education programs. His expertise includes treating diabetes, hypertension, and respiratory conditions.',
        fees: 50000,
        address: {
            line1: 'Room 501, Crystal Tower',
            line2: 'Junction Square, Kyun Taw Road, Kamayut Township, Yangon'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Khin Ma Ma',
        image: doc2,
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, Dr.Med.Sc (OG)',
        experience: 'Specialist',
        about: 'Dr. Khin Ma Ma is a dedicated obstetrician and gynecologist with extensive experience in managing high-risk pregnancies and gynecological conditions. She has trained at leading medical institutions in Myanmar and Singapore. Her practice focuses on providing comprehensive women\'s healthcare, from prenatal care to complex gynecological surgeries. She is known for her gentle approach and thorough patient care.',
        fees: 60000,
        address: {
            line1: 'No. 123, Pyay Road',
            line2: 'Mayangone Township, Yangon'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Than Htike Aung',
        image: doc3,
        speciality: 'Orthopaedics',
        degree: 'MBBS, M.Med.Sc (Ortho)',
        experience: 'Medical Officer',
        about: 'Dr. Than Htike Aung specializes in orthopedic surgery with particular expertise in sports injuries and joint replacements. He has received specialized training in minimally invasive surgical techniques. His practice incorporates modern rehabilitation protocols for optimal recovery outcomes. He is dedicated to providing comprehensive care for bone and joint conditions, from diagnosis through rehabilitation.',
        fees: 45000,
        address: {
            line1: 'No. 55, Kan Road',
            line2: 'Hlaing Township, Yangon'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Win Win Maw',
        image: doc4,
        speciality: 'Paediatrics',
        degree: 'MBBS, M.Med.Sc (Paediatrics)',
        experience: 'Medical Officer',
        about: 'Dr. Win Win Maw is a compassionate pediatrician who specializes in child development and pediatric care. She has extensive experience in treating common childhood illnesses and managing chronic pediatric conditions. Her gentle approach makes children feel comfortable during consultations. She is particularly interested in preventive care and childhood immunization programs.',
        fees: 40000,
        address: {
            line1: 'No. 234, Thanlwin Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Kyaw Zin Thant',
        image: doc5,
        speciality: 'Mental Health',
        degree: 'MBBS, M.Med.Sc (Psychiatry)',
        experience: 'Senior Consultant',
        about: 'Dr. Kyaw Zin Thant is a respected psychiatrist with expertise in treating various mental health conditions. He specializes in anxiety disorders, depression, and stress management. His approach combines modern psychiatric treatments with culturally sensitive counseling methods. He has been instrumental in promoting mental health awareness in Myanmar and reducing stigma around mental health care.',
        fees: 50000,
        address: {
            line1: 'Room 302, Medical Plaza',
            line2: 'Kabar Aye Pagoda Road, Yankin Township, Yangon'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Zaw Lin Htun',
        image: doc6,
        speciality: 'Mental Health',
        degree: 'MBBS, Dr.Med.Sc (Psychiatry)',
        experience: 'Senior Consultant',
        about: 'Dr. Zaw Lin Htun is a highly qualified psychiatrist specializing in mood disorders and addiction medicine. He has extensive experience in both inpatient and outpatient psychiatric care. His practice focuses on evidence-based treatments while incorporating mindfulness and traditional healing concepts. He regularly conducts mental health workshops and support group sessions.',
        fees: 55000,
        address: {
            line1: 'No. 45, University Avenue Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Tin Maung Win',
        image: doc7,
        speciality: 'General Medicine',
        degree: 'MBBS, M.Med.Sc (Internal Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Tin Maung Win is an experienced general physician with over 20 years of practice in internal medicine. He specializes in managing chronic diseases and providing comprehensive primary care. His patient-centered approach emphasizes preventive care and lifestyle modifications. He has particular expertise in treating cardiovascular conditions and diabetes.',
        fees: 45000,
        address: {
            line1: 'No. 78, Insein Road',
            line2: 'Hlaing Township, Yangon'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Myat Thu Zar',
        image: doc8,
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, M.Med.Sc (OG)',
        experience: 'Specialist',
        about: 'Dr. Myat Thu Zar is a skilled obstetrician and gynecologist with special interest in reproductive medicine and minimal invasive surgery. She has received advanced training in laparoscopic procedures and manages high-risk pregnancies. Her practice emphasizes women\'s health throughout all life stages. She conducts regular antenatal classes and women\'s health education sessions.',
        fees: 55000,
        address: {
            line1: 'No. 90, Bo Aung Kyaw Street',
            line2: 'Botahtaung Township, Yangon'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Soe Tun',
        image: doc9,
        speciality: 'Orthopaedics',
        degree: 'MBBS, M.Med.Sc (Ortho)',
        experience: 'Medical Officer',
        about: 'Dr. Soe Tun specializes in orthopedic trauma and sports medicine. His expertise includes joint replacement surgery and treatment of sports-related injuries. He has received specialized training in arthroscopic procedures and modern rehabilitation techniques. He is committed to helping patients regain mobility and function through comprehensive treatment plans.',
        fees: 40000,
        address: {
            line1: 'No. 156, Lower Kyeemyindaing Road',
            line2: 'Kyeemyindaing Township, Yangon'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Hla Myat Nwe',
        image: doc10,
        speciality: 'Paediatrics',
        degree: 'MBBS, M.Med.Sc (Paediatrics)',
        experience: 'Medical Officer',
        about: 'Dr. Hla Myat Nwe is a dedicated pediatrician with special interest in newborn care and childhood development. Her gentle and patient approach makes her popular among young patients and their families. She specializes in managing common pediatric conditions and provides comprehensive child healthcare services. She regularly conducts parent education sessions on child nutrition and development.',
        fees: 45000,
        address: {
            line1: 'No. 223, Sule Pagoda Road',
            line2: 'Kyauktada Township, Yangon'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Aye Myat Mon',
        image: doc11,
        speciality: 'Mental Health',
        degree: 'MBBS, M.Med.Sc (Psychiatry)',
        experience: 'Senior Consultant',
        about: 'Dr. Aye Myat Mon is an experienced psychiatrist specializing in mood disorders and anxiety management. She combines modern psychiatric treatments with holistic healing approaches. Her practice focuses on creating personalized treatment plans that address both immediate symptoms and long-term well-being. She is active in mental health advocacy and community education.',
        fees: 50000,
        address: {
            line1: 'No. 67, Dhammazedi Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Myo Min Zaw',
        image: doc12,
        speciality: 'Mental Health',
        degree: 'MBBS, M.Med.Sc (Psychiatry)',
        experience: 'Senior Consultant',
        about: 'Dr. Myo Min Zaw specializes in treating complex mental health conditions with a focus on depression and anxiety disorders. His approach integrates modern psychiatric methods with traditional healing practices. He has extensive experience in both medication management and psychotherapy. He conducts regular mental health awareness programs and support group sessions.',
        fees: 55000,
        address: {
            line1: 'No. 445, New University Avenue Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Kyi Pyar Thein',
        image: doc13,
        speciality: 'General Medicine',
        degree: 'MBBS, M.Med.Sc (Internal Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Kyi Pyar Thein is a highly experienced general physician with expertise in managing chronic diseases and preventive healthcare. Her practice emphasizes comprehensive health assessments and personalized treatment plans. She has particular interest in lifestyle medicine and managing metabolic disorders. She regularly conducts health education sessions for her patients.',
        fees: 45000,
        address: {
            line1: 'No. 88, Strand Road',
            line2: 'Kyauktada Township, Yangon'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Su Su Htwe',
        image: doc14,
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, M.Med.Sc (OG)',
        experience: 'Specialist',
        about: 'Dr. Su Su Htwe is a dedicated obstetrician and gynecologist with special interest in maternal-fetal medicine. She has extensive experience in managing high-risk pregnancies and gynecological surgeries. Her practice incorporates modern prenatal care techniques and women\'s health services. She regularly conducts antenatal classes and women\'s wellness programs.',
        fees: 50000,
        address: {
            line1: 'No. 345, Merchant Road',
            line2: 'Botahtaung Township, Yangon'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Kyaw Thu Ya',
        image: doc15,
        speciality: 'Orthopaedics',
        degree: 'MBBS, M.Med.Sc (Ortho)',
        experience: 'Medical Officer',
        about: 'Dr. Kyaw Thu Ya specializes in orthopedic surgery with focus on trauma care and joint problems. He has received specialized training in minimally invasive techniques and modern rehabilitation protocols. His practice emphasizes comprehensive care from diagnosis through rehabilitation. He is particularly experienced in sports injury management and joint preservation techniques.',
        fees: 45000,
        address: {
            line1: 'No. 167, Upper Pazundaung Road',
            line2: 'Pazundaung Township, Yangon'
        }
    },
    {
        _id: 'doc16',
        name: 'Dr. Thant Zin',
        image: getDoctorImage(15),
        speciality: 'General Medicine',
        degree: 'MBBS, M.Med.Sc (Internal Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Thant Zin is a distinguished general medicine specialist with over 15 years of experience in treating complex medical conditions. He specializes in preventive medicine and managing chronic diseases such as diabetes, hypertension, and respiratory conditions. His patient-centered approach emphasizes thorough diagnosis and personalized treatment plans. He regularly participates in international medical conferences and has contributed to several research papers on tropical diseases common in Myanmar. Dr. Thant Zin is committed to providing comprehensive healthcare while incorporating both modern medical practices and cultural sensitivity in his treatments.',
        fees: 50000,
        address: {
            line1: 'No. 123, Pyay Road',
            line2: 'Mayangone Township, Yangon'
        }
    },
    {
        _id: 'doc17',
        name: 'Dr. Aye Myat Thu',
        image: getDoctorImage(16),
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, Dr.Med.Sc (OG)',
        experience: 'Professor',
        about: 'Dr. Aye Myat Thu is a leading expert in obstetrics and gynaecology with extensive experience in high-risk pregnancies and gynecological surgeries. She has pioneered several minimally invasive surgical techniques in Myanmar and has trained numerous young doctors in modern obstetric care. Her research focuses on improving maternal health outcomes in rural areas. She is known for her compassionate approach to women\'s healthcare and has established several outreach programs for maternal health education. Her dedication to patient care extends beyond the clinic, as she regularly conducts workshops for expectant mothers and healthcare workers.',
        fees: 60000,
        address: {
            line1: 'No. 45, University Avenue Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc18',
        name: 'Dr. Kyaw Zaya',
        image: getDoctorImage(17),
        speciality: 'Orthopaedics',
        degree: 'MBBS, M.Med.Sc (Ortho)',
        experience: 'Specialist',
        about: 'Dr. Kyaw Zaya specializes in advanced orthopedic procedures and sports medicine. With training from leading institutions in Thailand and Singapore, he brings international expertise in joint replacement surgery and trauma care. His practice incorporates the latest techniques in minimally invasive surgery and rehabilitation protocols. He has successfully treated numerous athletes and has been a consulting physician for several national sports teams. His research interests include improving outcomes in joint replacement surgery and developing better rehabilitation strategies for complex fractures.',
        fees: 55000,
        address: {
            line1: 'No. 78, Kabar Aye Pagoda Road',
            line2: 'Yankin Township, Yangon'
        }
    },
    {
        _id: 'doc19',
        name: 'Dr. Win Min Htut',
        image: getDoctorImage(18),
        speciality: 'Paediatrics',
        degree: 'MBBS, M.Med.Sc (Paediatrics)',
        experience: 'Senior Consultant',
        about: 'Dr. Win Min Htut is a highly regarded pediatrician with special interest in childhood development and infectious diseases. His gentle approach and expertise in handling complex pediatric cases have made him a trusted name among parents. He has established innovative programs for early childhood intervention and vaccination awareness. His research work includes studies on childhood nutrition in Myanmar and the impact of environmental factors on child health. He regularly conducts parent education sessions and has developed several child health monitoring programs.',
        fees: 45000,
        address: {
            line1: 'No. 234, Insein Road',
            line2: 'Hlaing Township, Yangon'
        }
    },
    {
        _id: 'doc20',
        name: 'Dr. Mya Thida',
        image: getDoctorImage(19),
        speciality: 'Mental Health',
        degree: 'MBBS, Dr.Med.Sc (Psychiatry)',
        experience: 'Professor',
        about: 'Dr. Mya Thida is a pioneering psychiatrist who has been instrumental in developing mental health services in Myanmar. Her expertise spans across various mental health conditions, with special focus on depression, anxiety disorders, and trauma therapy. She has established several community mental health programs and works actively to reduce stigma around mental health issues. Her research includes groundbreaking studies on the impact of cultural factors on mental health treatment in Myanmar. She regularly conducts workshops for healthcare professionals on mental health assessment and treatment protocols.',
        fees: 50000,
        address: {
            line1: 'No. 56, Thanlwin Road',
            line2: 'Golden Valley, Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc21',
        name: 'Dr. Aung Kyaw Moe',
        image: getDoctorImage(20),
        speciality: 'Surgery',
        degree: 'MBBS, M.Med.Sc (Surgery)',
        experience: 'Senior Consultant',
        about: 'Dr. Aung Kyaw Moe is a renowned general surgeon with expertise in minimally invasive surgical techniques. His surgical experience spans a wide range of procedures, from routine operations to complex emergency surgeries. He has introduced several innovative surgical techniques to Myanmar and regularly trains young surgeons in advanced procedures. His research focuses on improving surgical outcomes and reducing recovery times through enhanced surgical protocols. He is known for his precise surgical skills and excellent patient care management.',
        fees: 70000,
        address: {
            line1: 'No. 789, Bogyoke Aung San Road',
            line2: 'Lanmadaw Township, Yangon'
        }
    },
    {
        _id: 'doc22',
        name: 'Dr. Su Mon Aung',
        image: getDoctorImage(21),
        speciality: 'Eye',
        degree: 'MBBS, M.Med.Sc (Ophthalmology)',
        experience: 'Specialist',
        about: 'Dr. Su Mon Aung is a skilled ophthalmologist specializing in retinal diseases and cataract surgery. She has performed thousands of successful eye surgeries and is particularly known for her expertise in treating diabetic retinopathy. Her practice incorporates the latest diagnostic and treatment technologies in eye care. She has been involved in several eye care missions in rural Myanmar and has contributed significantly to preventing blindness through early intervention programs. Her research interests include advancing cataract surgery techniques and managing age-related eye conditions.',
        fees: 45000,
        address: {
            line1: 'No. 432, Merchant Road',
            line2: 'Botahtaung Township, Yangon'
        }
    },
    {
        _id: 'doc23',
        name: 'Dr. Zaw Lin Tun',
        image: getDoctorImage(22),
        speciality: 'Ear, Nose and Throat',
        degree: 'MBBS, M.Med.Sc (ENT)',
        experience: 'Senior Consultant',
        about: 'Dr. Zaw Lin Tun is an experienced ENT specialist with particular expertise in endoscopic sinus surgery and hearing disorders. He has introduced several modern diagnostic and treatment techniques in ENT practice in Myanmar. His approach combines surgical expertise with conservative management options for optimal patient outcomes. He has conducted extensive research on hearing loss prevention and treatment of chronic sinusitis. His clinic is equipped with advanced diagnostic tools for comprehensive ENT care.',
        fees: 50000,
        address: {
            line1: 'No. 567, Lower Kyeemyindaing Road',
            line2: 'Kyeemyindaing Township, Yangon'
        }
    },
    {
        _id: 'doc24',
        name: 'Dr. Thin Thin Nwe',
        image: getDoctorImage(23),
        speciality: 'Dental',
        degree: 'BDS, M.D.Sc (Prosthodontics)',
        experience: 'Specialist',
        about: 'Dr. Thin Thin Nwe is a highly skilled dental surgeon specializing in cosmetic dentistry and oral rehabilitation. She has extensive experience in dental implants and full mouth reconstruction cases. Her modern dental practice incorporates digital dentistry techniques for precise treatment planning and execution. She regularly updates her skills through international dental conferences and workshops. Her approach to dental care emphasizes preventive measures and patient education for long-term oral health maintenance.',
        fees: 40000,
        address: {
            line1: 'No. 890, Anawrahta Road',
            line2: 'Lanmadaw Township, Yangon'
        }
    },
    {
        _id: 'doc25',
        name: 'Dr. Myat Thu Zar',
        image: getDoctorImage(24),
        speciality: 'Traditional Medicine',
        degree: 'B.M.T.M, M.Med.Sc (Traditional Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Myat Thu Zar is a respected practitioner of traditional Myanmar medicine with modern medical training. She specializes in integrating traditional healing methods with contemporary healthcare practices. Her expertise includes herbal medicine, traditional massage therapy, and natural healing techniques. She has conducted extensive research on the efficacy of traditional Myanmar medicines in treating chronic conditions. Her holistic approach to healthcare has helped many patients achieve better health outcomes through natural healing methods.',
        fees: 35000,
        address: {
            line1: 'No. 345, Bo Aung Kyaw Street',
            line2: 'Botahtaung Township, Yangon'
        }
    },
    {
        _id: 'doc26',
        name: 'Dr. Phyo Wai Aung',
        image: getDoctorImage(25),
        speciality: 'General Medicine',
        degree: 'MBBS, M.Med.Sc (Internal Medicine)',
        experience: 'Medical Officer',
        about: 'Dr. Phyo Wai Aung specializes in internal medicine with a focus on preventive care and management of chronic diseases. His approach emphasizes lifestyle modifications and patient education for better health outcomes. He has particular expertise in managing diabetes, hypertension, and respiratory conditions. His dedication to patient care includes comprehensive health screenings and detailed treatment plans. He actively participates in community health education programs and conducts regular health awareness sessions.',
        fees: 40000,
        address: {
            line1: 'No. 678, Strand Road',
            line2: 'Kyauktada Township, Yangon'
        }
    },
    {
        _id: 'doc27',
        name: 'Dr. Khin Maung Win',
        image: getDoctorImage(26),
        speciality: 'Surgery',
        degree: 'MBBS, M.Med.Sc (Surgery)',
        experience: 'Assistant Specialist',
        about: 'Dr. Khin Maung Win is a skilled surgeon specializing in laparoscopic and minimally invasive procedures. His surgical expertise includes both emergency and elective surgeries, with a particular focus on gastrointestinal procedures. He has received specialized training in advanced surgical techniques from international institutions. His commitment to patient care extends from detailed pre-operative counseling to comprehensive post-operative care. He regularly participates in surgical workshops and training programs to stay updated with the latest surgical advances.',
        fees: 55000,
        address: {
            line1: 'No. 123, Theinbyu Road',
            line2: 'Botahtaung Township, Yangon'
        }
    },
    {
        _id: 'doc28',
        name: 'Dr. Hnin Yu Lwin',
        image: getDoctorImage(27),
        speciality: 'Paediatrics',
        degree: 'MBBS, M.Med.Sc (Paediatrics)',
        experience: 'Specialist',
        about: 'Dr. Hnin Yu Lwin is a dedicated pediatrician with special interest in newborn care and childhood development. Her gentle approach and expertise in handling pediatric emergencies have earned her the trust of many families. She has established several programs for early childhood intervention and developmental assessment. Her practice focuses on preventive care and proper nutrition guidance for optimal child growth. She regularly conducts parenting workshops and vaccination awareness programs.',
        fees: 45000,
        address: {
            line1: 'No. 456, Pyi Road',
            line2: 'Kamayut Township, Yangon'
        }
    },
    {
        _id: 'doc29',
        name: 'Dr. Aung Myo Min',
        image: getDoctorImage(28),
        speciality: 'Mental Health',
        degree: 'MBBS, M.Med.Sc (Psychiatry)',
        experience: 'Specialist',
        about: 'Dr. Aung Myo Min specializes in treating various mental health conditions with a particular focus on anxiety disorders and depression. His approach combines modern psychiatric treatments with psychological counseling for comprehensive mental healthcare. He has established support groups for patients with similar conditions and conducts regular mental health awareness programs. His expertise includes stress management techniques and cognitive behavioral therapy. He actively works to reduce stigma around mental health issues in the community.',
        fees: 50000,
        address: {
            line1: 'No. 789, Baho Road',
            line2: 'Sanchaung Township, Yangon'
        }
    },
    {
        _id: 'doc30',
        name: 'Dr. Myat Noe Thu',
        image: getDoctorImage(29),
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, M.Med.Sc (OG)',
        experience: 'Senior Consultant',
        about: 'Dr. Myat Noe Thu is an experienced obstetrician and gynecologist specializing in high-risk pregnancies and gynecological surgeries. She has extensive experience in managing complicated pregnancies and has successfully handled numerous challenging cases. Her practice incorporates the latest techniques in prenatal care and women\'s health. She conducts regular antenatal classes and women\'s health awareness programs. Her approach emphasizes both medical excellence and emotional support during pregnancy.',
        fees: 60000,
        address: {
            line1: 'No. 234, Dhammazedi Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc31',
        name: 'Dr. Ye Myint Aung',
        image: getDoctorImage(30),
        speciality: 'Eye',
        degree: 'MBBS, M.Med.Sc (Ophthalmology)',
        experience: 'Senior Consultant',
        about: 'Dr. Ye Myint Aung is a highly experienced ophthalmologist specializing in corneal diseases and refractive surgery. His expertise includes advanced cataract surgery techniques and treatment of retinal disorders. He has performed thousands of successful eye surgeries and introduced several innovative treatment methods. His clinic is equipped with state-of-the-art diagnostic and surgical equipment. He regularly participates in eye care missions and conducts vision screening camps in rural areas.',
        fees: 55000,
        address: {
            line1: 'No. 567, Waizayandar Road',
            line2: 'South Okkalapa Township, Yangon'
        }
    },
    {
        _id: 'doc32',
        name: 'Dr. Thuzar Win',
        image: getDoctorImage(31),
        speciality: 'Dental',
        degree: 'BDS, M.D.Sc (Orthodontics)',
        experience: 'Specialist',
        about: 'Dr. Thuzar Win is a skilled dental surgeon with expertise in orthodontics and aesthetic dentistry. She specializes in modern orthodontic treatments and smile design procedures. Her practice incorporates digital dental technology for precise treatment planning and execution. She has received specialized training in invisible braces and cosmetic dental procedures. Her approach focuses on creating beautiful, functional smiles while ensuring optimal oral health.',
        fees: 45000,
        address: {
            line1: 'No. 890, Min Ye Kyaw Swar Road',
            line2: 'Lanmadaw Township, Yangon'
        }
    },
    {
        _id: 'doc33',
        name: 'Dr. Soe Tun',
        image: getDoctorImage(32),
        speciality: 'Ear, Nose and Throat',
        degree: 'MBBS, M.Med.Sc (ENT)',
        experience: 'Professor',
        about: 'Dr. Soe Tun is a renowned ENT specialist with extensive experience in treating complex ear, nose, and throat conditions. His expertise includes advanced endoscopic sinus surgery and treatment of hearing disorders. He has introduced several modern surgical techniques in Myanmar\'s ENT practice. His research interests include innovative treatments for chronic sinusitis and hearing loss. He regularly conducts workshops for young ENT surgeons and participates in international medical conferences.',
        fees: 65000,
        address: {
            line1: 'No. 123, Inya Road',
            line2: 'Kamaryut Township, Yangon'
        }
    },
    {
        _id: 'doc34',
        name: 'Dr. Tin Myo Win',
        image: getDoctorImage(33),
        speciality: 'Orthopaedics',
        degree: 'MBBS, M.Med.Sc (Ortho)',
        experience: 'Senior Consultant',
        about: 'Dr. Tin Myo Win is an experienced orthopedic surgeon specializing in joint replacement surgery and sports injuries. His expertise includes minimally invasive surgical techniques and advanced trauma care. He has successfully performed numerous complex joint replacements and reconstructive surgeries. His practice emphasizes early mobility and comprehensive rehabilitation programs. He regularly updates his skills through international training programs and workshops.',
        fees: 60000,
        address: {
            line1: 'No. 456, University Avenue',
            line2: 'Kamaryut Township, Yangon'
        }
    },
    {
        _id: 'doc35',
        name: 'Dr. Khin Thazin',
        image: getDoctorImage(34),
        speciality: 'Traditional Medicine',
        degree: 'B.M.T.M, M.Med.Sc (Traditional Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Khin Thazin is an experienced practitioner of traditional Myanmar medicine who combines ancient healing wisdom with modern medical knowledge. Her expertise includes herbal medicine, traditional therapeutic massages, and natural healing methods. She has conducted extensive research on traditional remedies for chronic conditions and pain management. Her holistic approach focuses on treating the root cause of ailments while promoting overall wellness. She regularly conducts workshops on traditional healing practices and their integration with modern healthcare.',
        fees: 40000,
        address: {
            line1: 'No. 789, Bo Ywe Street',
            line2: 'Dagon Township, Yangon'
        }
    },
    {
        _id: 'doc36',
        name: 'Dr. Zaw Myo Htut',
        image: getDoctorImage(35),
        speciality: 'Surgery',
        degree: 'MBBS, M.Med.Sc (Surgery)',
        experience: 'Senior Consultant',
        about: 'Dr. Zaw Myo Htut is a distinguished surgeon specializing in minimally invasive procedures and advanced laparoscopic surgery. With over 18 years of surgical experience, he has successfully performed thousands of operations ranging from routine procedures to complex emergency surgeries. His expertise includes gastrointestinal surgery and advanced trauma care. He has introduced several innovative surgical techniques in Myanmar and regularly conducts surgical training workshops for young surgeons. His commitment to patient care extends from thorough pre-operative assessment to comprehensive post-operative management.',
        fees: 65000,
        address: {
            line1: 'No. 556, Strand Road',
            line2: 'Latha Township, Yangon'
        }
    },
    {
        _id: 'doc37',
        name: 'Dr. Aye Aye Thein',
        image: getDoctorImage(36),
        speciality: 'Eye',
        degree: 'MBBS, M.Med.Sc (Ophthalmology)',
        experience: 'Professor',
        about: 'Dr. Aye Aye Thein is a renowned ophthalmologist with extensive experience in treating complex eye conditions. She specializes in advanced cataract surgery, glaucoma management, and retinal disorders. Her practice incorporates the latest diagnostic and surgical technologies in eye care. She has conducted numerous eye camps in rural areas of Myanmar and has been instrumental in preventing blindness through early detection programs. Her research work focuses on improving surgical outcomes in cataract surgery and managing diabetic retinopathy.',
        fees: 60000,
        address: {
            line1: 'Room 701, Crystal Tower',
            line2: 'Junction Square, Kyun Taw Road, Kamayut Township, Yangon'
        }
    },
    {
        _id: 'doc38',
        name: 'Dr. Kyaw Soe Lin',
        image: getDoctorImage(37),
        speciality: 'Dental',
        degree: 'BDS, M.D.Sc (Oral Surgery)',
        experience: 'Senior Consultant',
        about: 'Dr. Kyaw Soe Lin is a highly skilled dental surgeon specializing in oral surgery and implantology. His expertise includes complex dental extractions, dental implants, and maxillofacial procedures. He has received advanced training in dental implant surgery from prestigious institutions in Singapore and Thailand. His practice emphasizes patient comfort and utilizes the latest dental technologies for precise treatment planning. He regularly conducts workshops on advanced dental procedures and implant techniques.',
        fees: 50000,
        address: {
            line1: 'No. 234, Bo Aung Kyaw Street',
            line2: 'Kyauktada Township, Yangon'
        }
    },
    {
        _id: 'doc39',
        name: 'Dr. Thin Thin Yi',
        image: getDoctorImage(38),
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, Dr.Med.Sc (OG)',
        experience: 'Senior Consultant',
        about: 'Dr. Thin Thin Yi is an experienced obstetrician and gynecologist with particular expertise in high-risk pregnancies and gynecological oncology. She has successfully managed numerous complicated pregnancies and performed complex gynecological surgeries. Her practice incorporates modern prenatal diagnostic techniques and comprehensive women\'s healthcare services. She is known for her compassionate approach and has established several women\'s health awareness programs. She regularly conducts workshops on maternal health and family planning.',
        fees: 55000,
        address: {
            line1: 'No. 445, Pyay Road',
            line2: 'Ahlone Township, Yangon'
        }
    },
    {
        _id: 'doc40',
        name: 'Dr. Aung Thu Rein',
        image: getDoctorImage(39),
        speciality: 'Mental Health',
        degree: 'MBBS, M.Med.Sc (Psychiatry)',
        experience: 'Specialist',
        about: 'Dr. Aung Thu Rein specializes in treating various mental health conditions with particular expertise in mood disorders and addiction psychiatry. His approach combines evidence-based psychiatric treatments with culturally sensitive counseling methods. He has established several mental health support groups and conducts regular awareness programs. His practice focuses on comprehensive mental healthcare, including medication management and psychotherapy. He is actively involved in reducing mental health stigma through community education programs.',
        fees: 45000,
        address: {
            line1: 'No. 123, Inya Road',
            line2: 'Kamaryut Township, Yangon'
        }
    },
    {
        _id: 'doc41',
        name: 'Dr. Win Myint Oo',
        image: getDoctorImage(40),
        speciality: 'Orthopaedics',
        degree: 'MBBS, M.Med.Sc (Ortho)',
        experience: 'Professor',
        about: 'Dr. Win Myint Oo is a distinguished orthopedic surgeon with extensive experience in joint replacement surgery and spine disorders. He has pioneered several advanced surgical techniques in Myanmar and regularly trains young orthopedic surgeons. His expertise includes minimally invasive spine surgery and complex trauma care. He has conducted numerous workshops on advanced orthopedic procedures and has published several research papers on joint replacement outcomes in Myanmar.',
        fees: 70000,
        address: {
            line1: 'No. 567, Kabar Aye Pagoda Road',
            line2: 'Mayangone Township, Yangon'
        }
    },
    {
        _id: 'doc42',
        name: 'Dr. Myat Noe Hlaing',
        image: getDoctorImage(41),
        speciality: 'Paediatrics',
        degree: 'MBBS, M.Med.Sc (Paediatrics)',
        experience: 'Senior Consultant',
        about: 'Dr. Myat Noe Hlaing is a dedicated pediatrician with special interest in pediatric infectious diseases and developmental disorders. Her gentle approach and expertise in managing complex pediatric cases have earned her the trust of many families. She has established several early intervention programs and regularly conducts parent education sessions. Her practice emphasizes preventive care and proper childhood nutrition. She actively participates in childhood vaccination awareness campaigns.',
        fees: 45000,
        address: {
            line1: 'No. 789, University Avenue Road',
            line2: 'Bahan Township, Yangon'
        }
    },
    {
        _id: 'doc43',
        name: 'Dr. Thein Zaw Latt',
        image: getDoctorImage(42),
        speciality: 'Ear, Nose and Throat',
        degree: 'MBBS, M.Med.Sc (ENT)',
        experience: 'Senior Consultant',
        about: 'Dr. Thein Zaw Latt is an experienced ENT specialist with expertise in endoscopic sinus surgery and hearing disorders. He has introduced several modern surgical techniques in ENT practice and manages complex ear, nose, and throat conditions. His clinic is equipped with advanced diagnostic tools for comprehensive ENT care. He regularly conducts hearing screening camps and has been instrumental in establishing audiology services in Myanmar. His research interests include innovative treatments for chronic sinusitis.',
        fees: 50000,
        address: {
            line1: 'No. 345, Bo Ywe Street',
            line2: 'Kyauktada Township, Yangon'
        }
    },
    {
        _id: 'doc44',
        name: 'Dr. San San Yi',
        image: getDoctorImage(43),
        speciality: 'Traditional Medicine',
        degree: 'B.M.T.M, M.Med.Sc (Traditional Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. San San Yi is a respected practitioner of traditional Myanmar medicine with extensive experience in herbal medicine and traditional healing methods. She combines ancient healing wisdom with modern medical knowledge to provide holistic healthcare solutions. Her expertise includes traditional massage therapy, herbal treatments, and natural remedies. She has conducted extensive research on traditional Myanmar medicines and their effectiveness in treating chronic conditions. She regularly conducts workshops on traditional healing practices.',
        fees: 35000,
        address: {
            line1: 'No. 112, Anawrahta Road',
            line2: 'Pazundaung Township, Yangon'
        }
    },
    {
        _id: 'doc45',
        name: 'Dr. Myo Thura Zaw',
        image: getDoctorImage(44),
        speciality: 'General Medicine',
        degree: 'MBBS, M.Med.Sc (Internal Medicine)',
        experience: 'Senior Consultant',
        about: 'Dr. Myo Thura Zaw is an experienced internist specializing in cardiovascular diseases and diabetes management. His practice emphasizes preventive care and lifestyle modifications for better health outcomes. He has extensive experience in managing complex medical conditions and provides comprehensive primary healthcare services. He regularly conducts health education programs and has established several diabetes management clinics. His approach focuses on patient education and long-term health maintenance.',
        fees: 45000,
        address: {
            line1: 'No. 678, Lower Kyeemyindaing Road',
            line2: 'Kyeemyindaing Township, Yangon'
        }
    },
    {
        _id: 'doc46',
        name: 'Dr. Khin Khin Oo',
        image: getDoctorImage(45),
        speciality: 'Eye',
        degree: 'MBBS, M.Med.Sc (Ophthalmology)',
        experience: 'Specialist',
        about: 'Dr. Khin Khin Oo is a skilled ophthalmologist specializing in pediatric ophthalmology and strabismus surgery. She has extensive experience in treating various eye conditions in children and adults. Her practice incorporates the latest diagnostic and treatment technologies in eye care. She has been involved in several vision screening programs in schools and has contributed significantly to preventing childhood blindness. Her gentle approach makes her particularly popular with young patients.',
        fees: 45000,
        address: {
            line1: 'No. 234, Merchant Street',
            line2: 'Botahtaung Township, Yangon'
        }
    },
    {
        _id: 'doc47',
        name: 'Dr. Soe Tint Aung',
        image: getDoctorImage(46),
        speciality: 'Surgery',
        degree: 'MBBS, M.Med.Sc (Surgery)',
        experience: 'Professor',
        about: 'Dr. Soe Tint Aung is a renowned general surgeon with particular expertise in hepatobiliary surgery and surgical oncology. He has pioneered several advanced surgical techniques in Myanmar and regularly trains young surgeons. His surgical experience includes complex cancer surgeries and minimally invasive procedures. He has published numerous research papers on surgical techniques and outcomes. His practice emphasizes evidence-based surgical care and comprehensive pre and post-operative management.',
        fees: 75000,
        address: {
            line1: 'No. 445, Bogyoke Aung San Road',
            line2: 'Pabedan Township, Yangon'
        }
    },
    {
        _id: 'doc48',
        name: 'Dr. Nay Lin Tun',
        image: getDoctorImage(47),
        speciality: 'Dental',
        degree: 'BDS, M.D.Sc (Orthodontics)',
        experience: 'Senior Consultant',
        about: 'Dr. Nay Lin Tun is a highly skilled dental surgeon specializing in orthodontics and cosmetic dentistry. His expertise includes complex orthodontic cases and advanced smile design procedures. His practice incorporates digital dental technology for precise treatment planning and execution. He has received specialized training in invisible braces and modern orthodontic techniques. He regularly updates his skills through international dental conferences and conducts workshops for young dentists.',
        fees: 50000,
        address: {
            line1: 'No. 890, Maha Bandoola Road',
            line2: 'Lanmadaw Township, Yangon'
        }
    },
    {
        _id: 'doc49',
        name: 'Dr. Myint Myint San',
        image: getDoctorImage(48),
        speciality: 'Obstetrics and Gynaecology',
        degree: 'MBBS, Dr.Med.Sc (OG)',
        experience: 'Professor',
        about: 'Dr. Myint Myint San is a distinguished obstetrician and gynecologist with over 25 years of experience in women\'s healthcare. She specializes in high-risk pregnancies and gynecological oncology. Her practice incorporates the latest advances in prenatal care and gynecological surgery. She has established several women\'s health programs and regularly conducts research on maternal health outcomes. She is known for her comprehensive approach to women\'s healthcare throughout all life stages.',
        fees: 65000,
        address: {
            line1: 'No. 567, Pyay Road',
            line2: 'Kamayut Township, Yangon'
        }
    },
    {
        _id: 'doc50',
        name: 'Dr. Thet Naing Oo',
        image: getDoctorImage(49),
        speciality: 'Mental Health',
        degree: 'MBBS, Dr.Med.Sc (Psychiatry)',
        experience: 'Senior Consultant',
        about: 'Dr. Thet Naing Oo is a highly experienced psychiatrist specializing in mood disorders and psychotherapy. His approach combines modern psychiatric treatments with traditional healing concepts for comprehensive mental healthcare. He has established several mental health support programs and regularly conducts workshops on stress management and mental wellness. His practice emphasizes destigmatizing mental health treatment and providing culturally sensitive care. He actively participates in community mental health education.',
        fees: 55000,
        address: {
            line1: 'No. 123, Dhammazedi Road',
            line2: 'Bahan Township, Yangon'
        }
    }
]