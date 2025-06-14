import pandas as pd
from datetime import datetime

class SKUMapper:
    def __init__(self, mapping_df):
        self.mapping_dict = dict(zip(mapping_df["sku"], mapping_df["msku"]))

    def map_sku(self, sku):
        msku = self.mapping_dict.get(sku)
        if pd.isna(msku) or msku is None:
            return None
        return [m.strip() for m in str(msku).split(",")]

    def map_dataframe(self, df, sku_column):
        df["Mapped MSKU"] = df[sku_column].apply(self.map_sku)
        return df

    def log_unmapped(self, df, sku_column, filename="unmapped_log.txt"):
        unmapped = df[df["Mapped MSKU"].isnull()]
        if not unmapped.empty:
            with open(filename, "w") as f:
                f.write(f"Unmapped SKUs Log - {datetime.now()}\n\n")
                for sku in unmapped[sku_column]:
                    f.write(f"{sku}\n")
            return unmapped
        return pd.DataFrame()
