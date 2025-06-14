import streamlit as st
import pandas as pd
from sku_mapper import SKUMapper

st.set_page_config(page_title="SKU to MSKU Mapper", layout="centered")
st.title("🧮 SKU → MSKU Mapper (Assessment Ready)")

st.markdown("Upload your mapping CSV to override the default. If skipped, the built-in mapping file will be used.")

# Step 1: Load mapping file
mapping_file = st.file_uploader("🔁 Upload mapping CSV (optional)", type="csv")

if mapping_file:
    mapping_df = pd.read_csv(mapping_file)
    st.success("✅ Using uploaded mapping file.")
else:
    mapping_df = pd.read_csv("sku_msku_mapping.csv")
    st.info("📄 Using default mapping file: `sku_msku_mapping.csv`")

st.dataframe(mapping_df.head())

# Initialize mapper
mapper = SKUMapper(mapping_df)

# Step 2: Upload sales file
st.subheader("2️⃣ Upload Sales Data File")
sales_file = st.file_uploader("Upload sales CSV (must contain a SKU-like column)", type="csv")

if sales_file:
    sales_df = pd.read_csv(sales_file)
    st.success("✅ Sales data loaded.")
    st.dataframe(sales_df.head())

    # Always show SKU column selector
    default_col = next((col for col in sales_df.columns if col.strip().lower() in ["sku", "sku code", "product sku"]), None)
    selected_index = sales_df.columns.get_loc(default_col) if default_col in sales_df.columns else 0
    sku_col = st.selectbox("👉 Select the SKU column", options=sales_df.columns, index=selected_index)

    # Step 3: Mapping
    st.subheader("3️⃣ Mapped Output")
    sales_df = mapper.map_dataframe(sales_df, sku_col)
    st.dataframe(sales_df)

    # Step 4: Log unmapped SKUs
    unmapped = mapper.log_unmapped(sales_df, sku_col)
    if not unmapped.empty:
        st.warning(f"⚠️ {len(unmapped)} SKUs could not be mapped.")
        with st.expander("🔍 View Unmapped SKUs"):
            st.dataframe(unmapped[[sku_col]])
        st.text("📝 Log saved to 'unmapped_log.txt' in your project folder.")

    # Step 5: Download cleaned file
    st.subheader("4️⃣ Download Cleaned CSV")
    cleaned_csv = sales_df.to_csv(index=False).encode("utf-8")
    st.download_button("⬇️ Download Mapped CSV", cleaned_csv, "mapped_output.csv", "text/csv")

else:
    st.info("📎 Please upload a sales data file to continue.")
