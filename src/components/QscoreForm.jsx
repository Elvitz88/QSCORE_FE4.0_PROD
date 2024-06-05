// QscoreForm.jsx
import React, { useState } from 'react';

const QscoreForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  // Update form state on input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData({}); // Reset form
  };

  // Form layout with DaisyUI classes
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor || ''}
              onChange={handleChange}
              placeholder="Vendor"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material || ''}
              onChange={handleChange}
              placeholder="Material"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Qscore</label>
            <input
              type="number"
              name="qscore"
              value={formData.qscore || ''}
              onChange={handleChange}
              placeholder="Qscore"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Evaluate</label>
            <input
              type="text"
              name="evaluate"
              value={formData.evaluate || ''}
              onChange={handleChange}
              placeholder="Evaluate"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Sampling</label>
            <input
              type="text"
              name="sampling"
              value={formData.sampling || ''}
              onChange={handleChange}
              placeholder="Sampling"
              className="input input-bordered"
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Submit</button>
            <a href="#" className="btn" onClick={onCancel}>Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QscoreForm;
