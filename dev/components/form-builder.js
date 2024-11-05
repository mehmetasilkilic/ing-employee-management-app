import {LitElement, html, css} from 'lit';
import {z} from 'zod';

import {i18nMixin} from '../localization/i18n';

export class FormBuilder extends i18nMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      flex: 1;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    input,
    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      grid-column: 1 / -1;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button[type='submit'] {
      background-color: #28a745;
      color: white;
    }

    button[type='reset'] {
      background-color: #dc3545;
      color: white;
    }

    button:disabled {
      background-color: #ccc;
      cursor: default;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `;

  static properties = {
    schema: {type: Object},
    formFields: {type: Array},
    formData: {type: Object},
    errors: {type: Object},
    initialData: {type: Object},
  };

  constructor() {
    super();
    this.schema = null;
    this.formFields = [];
    this.formData = {};
    this.errors = {};
    this.initialData = null;
  }

  firstUpdated() {
    this.formData =
      this.initialData ||
      this.formFields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {});
  }

  updated(changedProperties) {
    if (changedProperties.has('initialData') && this.initialData) {
      this.formData = {...this.initialData};
      this.requestUpdate();
    }
  }

  validateField(name, value) {
    if (!this.schema) return;

    try {
      // Create a partial schema for the single field
      const fieldSchema = z.object({
        [name]: this.schema.shape[name],
      });

      fieldSchema.parse({[name]: value});

      // Clear error if validation passes
      const newErrors = {...this.errors};
      delete newErrors[name];
      this.errors = newErrors;
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors = {
          ...this.errors,
          [name]: error.errors[0].message,
        };
      }
    }
    this.requestUpdate();
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.value;

    this.formData = {
      ...this.formData,
      [field]: value,
    };

    this.validateField(field, value);

    this.dispatchEvent(
      new CustomEvent('form-change', {
        detail: {
          formData: this.formData,
          errors: this.errors,
          isValid: Object.keys(this.errors).length === 0,
        },
      })
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.schema) return;

    try {
      // Validate entire form
      this.schema.parse(this.formData);

      this.dispatchEvent(
        new CustomEvent('form-submit', {
          detail: this.formData,
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Update errors object with all validation errors
        this.errors = error.errors.reduce((acc, err) => {
          const fieldName = err.path[0];
          acc[fieldName] = err.message;
          return acc;
        }, {});
        this.requestUpdate();
      }
    }
  }

  renderField(field) {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return html`
          <input
            type=${field.type}
            id=${field.name}
            name=${field.name}
            .value=${this.formData[field.name] || ''}
            @input=${this.handleInput}
            placeholder=${field.placeholder || ''}
          />
        `;

      case 'date':
        return html`
          <input
            type="date"
            id=${field.name}
            name=${field.name}
            .value=${this.formData[field.name] || ''}
            @input=${this.handleInput}
            min=${field.minDate || ''}
            max=${field.maxDate || ''}
          />
        `;

      case 'select':
        return html`
          <select
            id=${field.name}
            name=${field.name}
            .value=${this.formData[field.name] || ''}
            @change=${this.handleInput}
          >
            <option value="">${field.label}</option>
            ${field.options.map(
              (option) => html`
                <option value=${option.value}>${option.label}</option>
              `
            )}
          </select>
        `;

      default:
        return html``;
    }
  }

  renderFormGroups() {
    const rows = [];
    let currentRow = [];

    this.formFields.forEach((field, index) => {
      if (field.fullWidth) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
        }
        rows.push([field]);
      } else {
        currentRow.push(field);
        if (currentRow.length === 2 || index === this.formFields.length - 1) {
          rows.push(currentRow);
          currentRow = [];
        }
      }
    });

    return rows.map(
      (row) => html`
        <div class="form-row">
          ${row.map(
            (field) => html`
              <div class="form-group ${field.fullWidth ? 'full-width' : ''}">
                <label for=${field.name}>${field.label}</label>
                ${this.renderField(field)}
                ${this.errors[field.name]
                  ? html` <div class="error">${this.errors[field.name]}</div> `
                  : ''}
              </div>
            `
          )}
        </div>
      `
    );
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit} novalidate>
        ${this.renderFormGroups()}
        <div class="form-row">
          <div class="actions">
            <button type="submit">${this.t('common.submit')}</button>
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('form-builder', FormBuilder);
