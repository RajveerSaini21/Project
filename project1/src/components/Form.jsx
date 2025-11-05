import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    fetch('/data/contactForm.json')
      .then((res) => res.json())
      .then((data) => setSchema(data))
      .catch((err) => console.error('Error loading form schema:', err));
  }, []);

  const onSubmit = (data) => {
    console.log('Form data:', data);
    alert('Thank you! Your response has been submitted.');
  };

  if (!schema) return <p>Loading form...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">{schema.title}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {schema.fields.map((field) => {
          const validationRules = {};
          if (field.validation?.required)
            validationRules.required = `${field.label} is required`;
          if (field.validation?.minLength)
            validationRules.minLength = {
              value: field.validation.minLength,
              message: `${field.label} must be at least ${field.validation.minLength} characters`
            };
          if (field.validation?.pattern)
            validationRules.pattern = {
              value: new RegExp(field.validation.pattern),
              message: `Invalid ${field.label}`
            };

          return (
            <div key={field.name}>
              <label className="block mb-1 font-medium">{field.label}</label>

              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  {...register(field.name, validationRules)}
                  className="w-full border rounded p-2"
                />
              )}

              {field.type === 'text' || field.type === 'email' ? (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name, validationRules)}
                  className="w-full border rounded p-2"
                />
              ) : null}

              {field.type === 'select' && (
                <select
                  {...register(field.name, validationRules)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div className="space-y-1">
                  {field.options.map((option) => (
                    <label key={option} className="block">
                      <input
                        type="radio"
                        value={option}
                        {...register(field.name, validationRules)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="space-y-1">
                  {field.options.map((option) => (
                    <label key={option} className="block">
                      <input
                        type="checkbox"
                        value={option}
                        {...register(field.name)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'autocomplete' && (
                <>
                  <input
                    list={field.name + '-list'}
                    placeholder={field.placeholder || 'Type to search...'}
                    {...register(field.name, validationRules)}
                    className="w-full border rounded p-2"
                  />
                  <datalist id={field.name + '-list'}>
                    {field.options.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </>
              )}

              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name].message}</p>
              )}
            </div>
          );
        })}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}
