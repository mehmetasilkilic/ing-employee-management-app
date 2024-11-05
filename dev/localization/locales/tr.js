export default {
  translation: {
    nav: {
      employees: 'Personeller',
      addNew: 'Yeni Ekle',
    },
    common: {
      ok: 'Tamam',
      proceed: 'Devam',
      cancel: 'İptal',
      success: 'Başarılı',
      error: 'Hata',
      areYouSure: 'Emin misiniz?',
      actions: 'İşlemler',
      submit: 'Kaydet',
      selectAll: 'Hepsini Seç',
      loading: 'Yükleniyor...',
    },
    employees: {
      title: 'Personel Listesi',
      deleteConfirmation: 'Personeli silmek istediğinize emin misiniz?',
      deleteError:
        'Personeli silerken bir hata oluştu. Lütfen tekrar deneyiniz.',
      deleteSuccess: 'Personel başarıyla silindi.',
      search: 'Arama...',
    },
    addEmployee: {
      title: 'Yeni Personel Ekle',
    },
    editEmployee: {
      title: 'Personeli Düzenle',
      saveSuccess:
        'Personel bilgilerindeki değişiklikler başarıyla kaydedildi.',
      saveConfirmation:
        'Personel bilgilerindeki değişiklikleri kaydetmek istediğinizden emin misiniz?',
      saveError:
        'Personel bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.',
    },
    forms: {
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
        min: 'Ad en az 2 karakter olmalıdır',
        max: 'Ad 50 karakterden az olmalıdır',
      },
      lastName: {
        required: 'Soyad alanı zorunludur',
        min: 'Soyad en az 2 karakter olmalıdır',
        max: 'Soyad 50 karakterden az olmalıdır',
      },
      dateOfBirth: {
        required: 'Doğum tarihi zorunludur',
        tooYoung: 'Çalışan en az 18 yaşında olmalıdır',
      },
      dateOfEmployment: {
        required: 'İşe başlama tarihi zorunludur',
        futureDate: 'İşe başlama tarihi gelecekte bir tarih olamaz',
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
