import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {z} from 'zod';

import {FormBuilder} from '../dev/components/form-builder.js';

suite('form-builder', () => {
  const sampleFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        {value: 'admin', label: 'Admin'},
        {value: 'user', label: 'User'},
      ],
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'text',
      fullWidth: true,
    },
  ];

  const sampleSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role: z.string().min(1, 'Role is required'),
    bio: z.string().optional(),
  });

  test('is defined', () => {
    const el = document.createElement('form-builder');
    assert.instanceOf(el, FormBuilder);
  });

  test('initializes with default values', async () => {
    const el = await fixture(html`<form-builder></form-builder>`);

    assert.isNull(el.schema);
    assert.deepEqual(el.formFields, []);
    assert.deepEqual(el.formData, {});
    assert.deepEqual(el.errors, {});
    assert.isNull(el.initialData);
  });

  suite('form rendering', () => {
    test('renders form fields correctly', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      await el.updateComplete;

      const formGroups = el.shadowRoot.querySelectorAll('.form-group');
      assert.equal(formGroups.length, sampleFields.length);

      // Check text input
      const firstNameInput = el.shadowRoot.querySelector(
        'input[name="firstName"]'
      );
      assert.exists(firstNameInput);
      assert.equal(firstNameInput.type, 'text');

      // Check select
      const roleSelect = el.shadowRoot.querySelector('select[name="role"]');
      assert.exists(roleSelect);
      assert.equal(
        roleSelect.options.length,
        sampleFields[2].options.length + 1
      ); // +1 for placeholder
    });

    test('handles full-width fields', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      const bioGroup = el.shadowRoot.querySelector('.form-group.full-width');
      assert.exists(bioGroup);
    });

    test('applies initial data', async () => {
      const initialData = {
        firstName: 'John',
        email: 'john@example.com',
        role: 'admin',
      };

      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
          .initialData=${initialData}
        ></form-builder>
      `);

      await el.updateComplete;

      const firstNameInput = el.shadowRoot.querySelector(
        'input[name="firstName"]'
      );
      assert.equal(firstNameInput.value, 'John');

      const roleSelect = el.shadowRoot.querySelector('select[name="role"]');
      assert.equal(roleSelect.value, 'admin');
    });
  });

  suite('form validation', () => {
    test('validates single field on input', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      const emailInput = el.shadowRoot.querySelector('input[name="email"]');
      emailInput.value = 'invalid-email';
      emailInput.dispatchEvent(new Event('input'));

      await el.updateComplete;

      const errorDiv = el.shadowRoot.querySelector('.error');
      assert.exists(errorDiv);
      assert.include(errorDiv.textContent, 'Invalid email');
    });

    test('clears field error when valid', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      const emailInput = el.shadowRoot.querySelector('input[name="email"]');

      // First make it invalid
      emailInput.value = 'invalid-email';
      emailInput.dispatchEvent(new Event('input'));
      await el.updateComplete;

      // Then make it valid
      emailInput.value = 'valid@email.com';
      emailInput.dispatchEvent(new Event('input'));
      await el.updateComplete;

      const errorDiv = el.shadowRoot.querySelector('.error');
      assert.notExists(errorDiv);
    });

    test('validates all fields on submit', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      const form = el.shadowRoot.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      await el.updateComplete;

      const errors = el.shadowRoot.querySelectorAll('.error');
      assert.isAtLeast(errors.length, 2); // At least firstName and email should be invalid
    });
  });

  suite('events', () => {
    test('emits form-change event on input', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      const input = el.shadowRoot.querySelector('input[name="firstName"]');

      setTimeout(() => {
        input.value = 'John';
        input.dispatchEvent(new Event('input'));
      });

      const {detail} = await oneEvent(el, 'form-change');
      assert.equal(detail.formData.firstName, 'John');
    });

    test('emits form-submit event with valid data', async () => {
      const el = await fixture(html`
        <form-builder
          .formFields=${sampleFields}
          .schema=${sampleSchema}
        ></form-builder>
      `);

      // Set valid form data
      el.formData = {
        firstName: 'John',
        email: 'john@example.com',
        role: 'admin',
        bio: 'Test bio',
      };

      setTimeout(() => {
        const form = el.shadowRoot.querySelector('form');
        form.dispatchEvent(new Event('submit'));
      });

      const {detail} = await oneEvent(el, 'form-submit');
      assert.deepEqual(detail, el.formData);
    });
  });

  suite('edge cases', () => {
    test('handles empty options in select', async () => {
      const fieldsWithEmptyOptions = [
        {
          name: 'test',
          label: 'Test',
          type: 'select',
          options: [],
        },
      ];

      const el = await fixture(html`
        <form-builder .formFields=${fieldsWithEmptyOptions}></form-builder>
      `);

      const select = el.shadowRoot.querySelector('select');
      assert.equal(select.options.length, 1); // Only placeholder
    });

    test('handles unknown field type', async () => {
      const fieldsWithUnknownType = [
        {
          name: 'test',
          label: 'Test',
          type: 'unknown',
        },
      ];

      const el = await fixture(html`
        <form-builder .formFields=${fieldsWithUnknownType}></form-builder>
      `);

      const formGroup = el.shadowRoot.querySelector('.form-group');
      assert.exists(formGroup);
      assert.notExists(formGroup.querySelector('input'));
      assert.notExists(formGroup.querySelector('select'));
    });

    test('handles form submission without schema', async () => {
      const el = await fixture(html`
        <form-builder .formFields=${sampleFields}></form-builder>
      `);

      const form = el.shadowRoot.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      await el.updateComplete;
      assert.deepEqual(el.errors, {});
    });
  });
});
