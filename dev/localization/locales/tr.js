export default {
  translation: {
    nav: {
      employees: 'Personeller',
      addEmployee: 'Yeni Ekle',
    },
    employees: {
      title: 'Personel Listesi',
      deleteConfirmation: 'Personeli silmek istediğinize emin misiniz?',
      deleteError:
        'Personeli silerken bir hata oluştu. Lütfen tekrar deneyiniz.',
    },
    addEmployee: {
      title: 'Yeni Personel Ekle',
    },
    editEmployee: {
      title: 'Personeli Düzenle',
      saveConfirmation:
        'Personel bilgilerindeki değişiklikleri kaydetmek istediğinizden emin misiniz?',
      saveError:
        'Personel bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.',
    },
    forms: {
      addEditEmployee: {
        departments: {
          analytics: 'Analitik',
          tech: 'Teknoloji',
        },
        positions: {
          junior: 'Junior',
          medior: 'Medior',
          senior: 'Kıdemli',
        },
        employeeForm: {
          firstName: {
            label: 'Ad',
            placeholder: 'Adınızı girin',
          },
          lastName: {
            label: 'Soyad',
            placeholder: 'Soyadınızı girin',
          },
          dateOfBirth: {
            label: 'Doğum Tarihi',
          },
          dateOfEmployment: {
            label: 'İşe Başlama Tarihi',
          },
          phone: {
            label: 'Telefon Numarası',
            placeholder: 'Telefon numaranızı girin',
          },
          email: {
            label: 'E-posta Adresi',
            placeholder: 'E-posta adresinizi girin',
          },
          department: {
            label: 'Departman',
          },
          position: {
            label: 'Pozisyon',
          },
        },
      },
    },

    validation: {
      required: 'Bu alan zorunludur',
      email: {
        required: 'E-posta adresi zorunludur',
        invalid: 'Lütfen geçerli bir e-posta adresi girin',
      },
      phone: {
        required: 'Telefon numarası zorunludur',
        invalid: 'Lütfen geçerli bir telefon numarası girin',
      },
      firstName: {
        required: 'Ad alanı zorunludur',
        min: 'Ad en az {{min}} karakter olmalıdır',
        max: 'Ad {{max}} karakterden az olmalıdır',
      },
      lastName: {
        required: 'Soyad alanı zorunludur',
        min: 'Soyad en az {{min}} karakter olmalıdır',
        max: 'Soyad {{max}} karakterden az olmalıdır',
      },
      dateOfBirth: {
        required: 'Doğum tarihi zorunludur',
      },
      dateOfEmployment: {
        required: 'İşe başlama tarihi zorunludur',
      },
      department: {
        required: 'Departman seçimi zorunludur',
      },
      position: {
        required: 'Pozisyon seçimi zorunludur',
      },
    },
  },
};
